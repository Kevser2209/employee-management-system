import { useEffect } from "react";

export function useEscapeKey(isActive, onEscape, disabled = false) {
  useEffect(() => {
    if (!isActive || disabled) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onEscape, disabled]);
}
