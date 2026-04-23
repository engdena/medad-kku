import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Ctx = {
  highContrast: boolean;
  toggleHighContrast: () => void;
  ttsEnabled: boolean;
  toggleTts: () => void;
  speak: (text: string) => void;
  largeText: boolean;
  toggleLargeText: () => void;
};

const AccessibilityContext = createContext<Ctx | null>(null);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [highContrast, setHc] = useState(false);
  const [ttsEnabled, setTts] = useState(false);
  const [largeText, setLarge] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("hc-mode", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? "18px" : "";
  }, [largeText]);

  const speak = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1; u.pitch = 1;
    window.speechSynthesis.speak(u);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast: () => setHc((v) => !v),
        ttsEnabled,
        toggleTts: () => setTts((v) => !v),
        speak,
        largeText,
        toggleLargeText: () => setLarge((v) => !v),
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be inside AccessibilityProvider");
  return ctx;
};