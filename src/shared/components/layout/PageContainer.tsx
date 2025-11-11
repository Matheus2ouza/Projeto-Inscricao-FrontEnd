"use client";

import { Button } from "@/shared/components/ui/button";
import { PAGE_CONTAINER_CLASSES } from "@/shared/constants/layout";
import { cn } from "@/shared/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backButtonAction?: () => void;
  className?: string;
  containerClassName?: string;
}

/**
 * Componente wrapper para páginas com layout consistente
 *
 * @example
 * <PageContainer
 *   title="Minhas Inscrições"
 *   description="Visualize todas as suas inscrições nos eventos"
 * >
 *   <MyContent />
 * </PageContainer>
 */
export default function PageContainer({
  children,
  title,
  description,
  showBackButton = true,
  backButtonAction,
  className,
  containerClassName,
}: PageContainerProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backButtonAction) {
      backButtonAction();
    } else {
      router.back();
    }
  };

  return (
    <div className={cn(PAGE_CONTAINER_CLASSES.background, className)}>
      <div className={cn(PAGE_CONTAINER_CLASSES.container, containerClassName)}>
        {(title || showBackButton) && (
          <div className={PAGE_CONTAINER_CLASSES.header}>
            {showBackButton && (
              <Button variant="outline" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {title && (
              <div>
                <h1 className={PAGE_CONTAINER_CLASSES.title}>{title}</h1>
                {description && (
                  <p className={PAGE_CONTAINER_CLASSES.description}>
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
