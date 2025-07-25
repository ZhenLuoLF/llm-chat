"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="tokyo-night"
      enableSystem={false}
      themes={["tokyo-night", "tokyo-light"]}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
