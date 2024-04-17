"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "next-themes";
import { FC, ReactNode } from "react";

type GlobalProvidersProps = {
  children: ReactNode;
};

const GlobalProviders: FC<GlobalProvidersProps> = ({ children }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        // enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default GlobalProviders;
