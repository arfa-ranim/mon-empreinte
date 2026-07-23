"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useRef, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isMountedRef = useRef(false);

  // Use a ref to avoid the ESLint warning
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      setMounted(true);
    }
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}