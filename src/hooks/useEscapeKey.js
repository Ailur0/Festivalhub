import { useEffect } from 'react';

// Calls onEscape when Escape is pressed while isActive is true (e.g. a modal is open)
const useEscapeKey = (isActive, onEscape) => {
  useEffect(() => {
    if (!isActive) return undefined;

    const handleKeyDown = (event) => {
      if (event?.key === 'Escape') onEscape?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEscape]);
};

export default useEscapeKey;
