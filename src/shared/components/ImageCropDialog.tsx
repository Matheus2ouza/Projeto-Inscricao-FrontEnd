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
    // Render a fixed canvas of targetWidth x targetHeight, draw the image applying pan/zoom like CSS background-size: contain/cover.
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;

    // Determine how the image is displayed inside the viewport at current scale & offset
    // The viewport on screen has some pixel size; we will compute scale mapping based on container size
    const container = containerRef.current as HTMLDivElement;
    const viewportRect = container.getBoundingClientRect();
    const viewportWidth = viewportRect.width;
    const viewportHeight = viewportRect.height;

    // Base image fit to cover the viewport
    const baseScale = Math.max(
      viewportWidth / img.naturalWidth,
      viewportHeight / img.naturalHeight
    );
    const appliedScale = baseScale * scale;
    const displayWidth = img.naturalWidth * appliedScale;
    const displayHeight = img.naturalHeight * appliedScale;

    // The image center in viewport coordinates (0,0) at center
    const centerX = viewportWidth / 2 + offset.x;
    const centerY = viewportHeight / 2 + offset.y;

    // Top-left of image on screen
    const imageLeft = centerX - displayWidth / 2;
    const imageTop = centerY - displayHeight / 2;

    // Now map viewport (target crop) to image pixel coordinates
    // For each target canvas pixel, corresponds to a viewport pixel scaled to target dims
    // Equivalent shortcut: compute the portion of original image that is visible in viewport and scale into target canvas
    const sx = Math.max(0, ((0 - imageLeft) / displayWidth) * img.naturalWidth);
    const sy = Math.max(
      0,
      ((0 - imageTop) / displayHeight) * img.naturalHeight
    );
    const sWidth = Math.min(
      img.naturalWidth,
      (viewportWidth / displayWidth) * img.naturalWidth
    );
    const sHeight = Math.min(
      img.naturalHeight,
      (viewportHeight / displayHeight) * img.naturalHeight
    );

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      img,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      targetWidth,
      targetHeight
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
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
            <div className="space-y-3">
              <div
                ref={containerRef}
                className="relative w-full bg-black/70 rounded-md overflow-hidden select-none"
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
          <Button onClick={handleConfirm} disabled={!imageUrl}>
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
