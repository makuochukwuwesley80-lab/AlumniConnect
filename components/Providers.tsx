"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ProvidersProps = React.ComponentProps<typeof NextThemesProvider>;

export default function Providers({ children, ...props }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}