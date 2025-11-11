"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Slider } from "@/shared/components/ui/slider";
import { cn } from "@/shared/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

type ImageCropDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  aspect?: number; // width / height, default 16/9
  targetWidth?: number; // default 1920
  targetHeight?: number; // default 1080
  onConfirm: (output: { blob: Blob; base64: string; file: File }) => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

const DEFAULT_ASPECT = 16 / 9;

export default function ImageCropDialog({
  open,
  onOpenChange,
  title = "Editar imagem",
  description = "Envie uma imagem, posicione e ajuste o zoom. Salvaremos em 1920x1080.",
  aspect = DEFAULT_ASPECT,
  targetWidth = 1920,
  targetHeight = 1080,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: ImageCropDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Transform controls (pan/zoom)
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastOffsetRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Cleanup URL when closing
  useEffect(() => {
    if (!open) {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
      setFile(null);
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setIsPanning(false);
      panStartRef.current = null;
      lastOffsetRef.current = { x: 0, y: 0 };
    }
  }, [open]);

  const onFiles = (files: FileList | File[] | null) => {
    const f = files && (files instanceof FileList ? files[0] : files[0]);
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    const url = URL.createObjectURL(f);
    setFile(f);
    setImageUrl(url);
    // Reset transforms
    setScale(1);
    setOffset({ x: 0, y: 0 });
    lastOffsetRef.current = { x: 0, y: 0 };
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!imageUrl) return;
    e.preventDefault();
    const delta = -e.deltaY;
    const zoomIntensity = 0.0015; // smooth
    const newScale = Math.min(5, Math.max(0.2, scale + delta * zoomIntensity));

    // Zoom towards cursor position
    const rect = (
      containerRef.current as HTMLDivElement
    ).getBoundingClientRect();
    const cursorX = e.clientX - rect.left - rect.width / 2;
    const cursorY = e.clientY - rect.top - rect.height / 2;
    const scaleRatio = newScale / scale;
    const newOffset = {
      x: cursorX - (cursorX - offset.x) * scaleRatio,
      y: cursorY - (cursorY - offset.y) * scaleRatio,
    };
    setScale(newScale);
    setOffset(newOffset);
    lastOffsetRef.current = newOffset;
  };

  const startPan: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!imageUrl) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPan: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isPanning || !panStartRef.current) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    const newOffset = {
      x: lastOffsetRef.current.x + dx,
      y: lastOffsetRef.current.y + dy,
    };
    setOffset(newOffset);
  };

  const endPan = () => {
    if (!isPanning) return;
    lastOffsetRef.current = { ...offset };
    setIsPanning(false);
    panStartRef.current = null;
  };

  const viewportPadding = 0; // can add if needed
  const viewportStyle = useMemo(
    () => ({
      paddingTop: `${(1 / aspect) * 100}%`,
    }),
    [aspect]
  );

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    onFiles(e.dataTransfer.files);
  };

  const handleConfirm = async () => {
    if (!imageUrl || !imgRef.current) return;
    // Render a fixed canvas of targetWidth x targetHeight
    // We want to preserve what's visible in the viewport, including black bars (contain mode)
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill canvas with black background first
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const img = imgRef.current;

    // Get viewport dimensions
    const container = containerRef.current as HTMLDivElement;
    const viewportRect = container.getBoundingClientRect();
    const viewportWidth = viewportRect.width;
    const viewportHeight = viewportRect.height;

    // Calculate how the image is displayed in the viewport (contain mode)
    const viewportAspect = viewportWidth / viewportHeight;
    const imageAspect = img.naturalWidth / img.naturalHeight;

    // Base scale to fit image in viewport (contain mode) - preserves entire image
    let baseScale: number;
    if (imageAspect > viewportAspect) {
      // Image is wider - fit width, will have black bars top/bottom
      baseScale = viewportWidth / img.naturalWidth;
    } else {
      // Image is taller - fit height, will have black bars left/right
      baseScale = viewportHeight / img.naturalHeight;
    }

    // Apply user zoom
    const appliedScale = baseScale * scale;
    const scaledImageWidth = img.naturalWidth * appliedScale;
    const scaledImageHeight = img.naturalHeight * appliedScale;

    // Calculate image position in viewport (centered + offset)
    const imageCenterX = viewportWidth / 2 + offset.x;
    const imageCenterY = viewportHeight / 2 + offset.y;

    // Top-left corner of scaled image in viewport coordinates
    const imageViewportLeft = imageCenterX - scaledImageWidth / 2;
    const imageViewportTop = imageCenterY - scaledImageHeight / 2;

    // Calculate what portion of the image is visible in the viewport
    // Map viewport rectangle to image coordinates
    const viewportLeftInImage = Math.max(0, -imageViewportLeft / appliedScale);
    const viewportTopInImage = Math.max(0, -imageViewportTop / appliedScale);
    const viewportRightInImage = Math.min(
      img.naturalWidth,
      (viewportWidth - imageViewportLeft) / appliedScale
    );
    const viewportBottomInImage = Math.min(
      img.naturalHeight,
      (viewportHeight - imageViewportTop) / appliedScale
    );

    const sx = viewportLeftInImage;
    const sy = viewportTopInImage;
    const sWidth = viewportRightInImage - viewportLeftInImage;
    const sHeight = viewportBottomInImage - viewportTopInImage;

    // Calculate how the image should be drawn on canvas (contain mode)
    // We want to preserve the same aspect ratio and positioning as in the viewport
    let canvasImageWidth: number;
    let canvasImageHeight: number;
    let canvasImageX: number;
    let canvasImageY: number;

    if (imageAspect > viewportAspect) {
      // Image is wider - fits width, add black bars top/bottom
      canvasImageWidth = targetWidth;
      canvasImageHeight = targetWidth / imageAspect;
      canvasImageX = 0;
      canvasImageY = (targetHeight - canvasImageHeight) / 2;
    } else {
      // Image is taller - fits height, add black bars left/right
      canvasImageWidth = targetHeight * imageAspect;
      canvasImageHeight = targetHeight;
      canvasImageX = (targetWidth - canvasImageWidth) / 2;
      canvasImageY = 0;
    }

    // Apply user zoom to the drawing area
    const zoomedCanvasWidth = canvasImageWidth * scale;
    const zoomedCanvasHeight = canvasImageHeight * scale;

    // Calculate offset based on pan, mapping viewport offset to canvas offset
    const canvasOffsetX = (offset.x / viewportWidth) * targetWidth;
    const canvasOffsetY = (offset.y / viewportHeight) * targetHeight;

    // Final position accounting for zoom and pan
    const finalCanvasX =
      canvasImageX + (canvasImageWidth - zoomedCanvasWidth) / 2 - canvasOffsetX;
    const finalCanvasY =
      canvasImageY +
      (canvasImageHeight - zoomedCanvasHeight) / 2 -
      canvasOffsetY;

    // Draw the visible portion of the image
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      img,
      sx,
      sy,
      sWidth,
      sHeight,
      finalCanvasX,
      finalCanvasY,
      zoomedCanvasWidth,
      zoomedCanvasHeight
    );

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92)
    );
    if (!blob) return;

    const base64 = await blobToBase64(blob);
    const file = new File([blob], "event-image-1920x1080.jpg", {
      type: "image/jpeg",
    });
    onConfirm({ blob, base64, file });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[70vw] sm:max-w-[65vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-hidden">
          {/* Dropzone / Input */}
          {!imageUrl && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
                isDraggingOver ? "border-primary bg-primary/5" : "border-muted"
              )}
              onClick={() => {
                const input = document.getElementById(
                  "image-input-hidden"
                ) as HTMLInputElement;
                input?.click();
              }}
            >
              <p className="text-sm mb-2">Arraste e solte uma imagem aqui</p>
              <p className="text-xs text-muted-foreground">
                ou clique para selecionar
              </p>
              <Input
                id="image-input-hidden"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => onFiles(e.target.files)}
              />
            </div>
          )}

          {/* Crop viewport */}
          {imageUrl && (
            <div className="space-y-3 min-w-0">
              <div
                ref={containerRef}
                className="relative w-full max-w-full bg-black/70 rounded-md overflow-hidden select-none"
                style={{ aspectRatio: `${aspect}` }}
                onWheel={handleWheel}
                onMouseDown={startPan}
                onMouseMove={onPan}
                onMouseUp={endPan}
                onMouseLeave={endPan}
              >
                {/* Centered viewport using absolute children */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Imagem para recorte"
                    className="pointer-events-none select-none will-change-transform"
                    draggable={false}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>

                {/* Overlay guides */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/10" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm w-16">Zoom</span>
                <Slider
                  value={[scale]}
                  min={0.2}
                  max={5}
                  step={0.01}
                  onValueChange={(v) => {
                    const newScale = v[0] ?? 1;
                    setScale(newScale);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="ml-auto"
                  onClick={() => {
                    setScale(1);
                    setOffset({ x: 0, y: 0 });
                    lastOffsetRef.current = { x: 0, y: 0 };
                  }}
                >
                  Resetar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setImageUrl(null);
                    setFile(null);
                  }}
                >
                  Trocar imagem
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!imageUrl}
            className="dark:text-white"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
