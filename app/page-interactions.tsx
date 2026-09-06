'use client';

import { useEffect } from 'react';

export default function PageInteractions() {
  useEffect(() => {
    const preventDefault = (event: Event) => event.preventDefault();
    const preventZoomShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && (
        ['+', '=', '-', '_', '0'].includes(event.key) ||
        ['Equal', 'Minus', 'Digit0', 'NumpadAdd', 'NumpadSubtract', 'Numpad0'].includes(event.code)
      )) event.preventDefault();
    };
    const preventWheelZoom = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    };

    document.body.classList.add('page-interaction-lock');
    document.addEventListener('contextmenu', preventDefault);
    window.addEventListener('keydown', preventZoomShortcut, true);
    window.addEventListener('wheel', preventWheelZoom, { passive: false });
    document.addEventListener('gesturestart', preventDefault, { passive: false });
    document.addEventListener('gesturechange', preventDefault, { passive: false });

    return () => {
      document.body.classList.remove('page-interaction-lock');
      document.removeEventListener('contextmenu', preventDefault);
      window.removeEventListener('keydown', preventZoomShortcut, true);
      window.removeEventListener('wheel', preventWheelZoom);
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
    };
  }, []);

  return null;
}
