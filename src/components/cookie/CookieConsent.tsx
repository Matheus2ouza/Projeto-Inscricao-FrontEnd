import React from "react";
import { Button } from "@/shared/components/ui/button";

export default function CookieConsent({ onAccept }: { onAccept: () => void }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const accepted = localStorage.getItem("cookieAccepted");
      if (!accepted) setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
    onAccept();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4 max-w-4xl w-full mx-2 backdrop-blur-sm">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <i className="bi bi-shield-check text-amber-600 dark:text-amber-400 text-sm"></i>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Cookies Necessários
            </h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
              Este site utiliza cookies essenciais para garantir seu
              funcionamento e segurança. Ao continuar, você concorda com o uso
              de cookies. Fique tranquilo — seus dados são protegidos e
              armazenados com segurança.
            </p>
          </div>
        </div>
        <Button
          className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
          onClick={handleAccept}
        >
          <i className="bi bi-check-lg mr-2"></i>
          Aceitar e Continuar
        </Button>
      </div>
    </div>
  );
}
