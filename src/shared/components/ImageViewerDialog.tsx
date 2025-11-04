"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Download, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface ImageViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  description?: string;
  downloadFileName?: string;
}

export default function ImageViewerDialog({
  isOpen,
  onClose,
  imageUrl,
  title = "Visualizar Imagem",
  description,
  downloadFileName,
}: ImageViewerDialogProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  const handleDownloadImage = async () => {
    try {
      setDownloadLoading(true);

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Criar um URL temporário para o blob
      const blobUrl = URL.createObjectURL(blob);

      // Criar um elemento link temporário
      const link = document.createElement("a");
      link.href = blobUrl;

      // Nome do arquivo
      const fileName = downloadFileName || `imagem-${Date.now()}.${getFileExtension(imageUrl)}`;
      link.download = fileName;

      // Simular clique no link para iniciar o download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar o URL do blob
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao fazer download da imagem:", error);
      // Fallback: abrir em nova aba se o download falhar
      window.open(imageUrl, "_blank");
    } finally {
      setDownloadLoading(false);
    }
  };

  // Função para obter a extensão do arquivo baseado na URL
  const getFileExtension = (url: string) => {
    const extension = url.split(".").pop()?.split("?")[0];
    return extension || "jpg"; // Fallback para jpg
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3)); // Máximo 3x
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5)); // Mínimo 0.5x
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Resetar zoom quando fechar
  const handleClose = () => {
    setZoom(1);
    setImageLoading(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Controles de Zoom e Download */}
        <div className="flex justify-between items-center gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetZoom}>
              Resetar
            </Button>
          </div>

          <Button
            onClick={handleDownloadImage}
            disabled={downloadLoading}
            size="sm"
            className="text-white"
          >
            {downloadLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download
          </Button>
        </div>

        {/* Container da Imagem com Scroll */}
        <div className="flex-1 overflow-auto rounded-lg bg-gray-100 dark:bg-gray-800 min-h-[400px] max-h-[60vh]">
          <div className="flex justify-center items-start p-4">
            {imageLoading && (
              <div className="flex items-center justify-center h-96 w-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            <img
              src={imageUrl}
              alt="Imagem ampliada"
              className={`rounded-lg transition-transform duration-200 ${imageLoading ? "hidden" : "block"}`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                maxWidth: "none",
                cursor: zoom > 1 ? "move" : "default",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Instruções */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Use os botões de zoom para ampliar ou reduzir a imagem
        </div>
      </DialogContent>
    </Dialog>
  );
}

