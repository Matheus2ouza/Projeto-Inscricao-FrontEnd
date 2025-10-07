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
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl px-8 py-3 flex flex-col sm:flex-row items-center gap-4 max-w-4xl w-full mx-2">
        <span className="text-gray-700 dark:text-gray-200 text-sm flex-1">
          Este site utiliza cookies para melhorar a experiência do usuário. Ao
          utilizar o nosso site, você concorda com todos os cookies de acordo
          com a nossa Política de Cookies.
        </span>
        <Button
          className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={handleAccept}
        >
          Aceitar
        </Button>
      </div>
    </div>
  );
}
