import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: Props) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="light"
    enableSystem={false}
    forcedTheme="light"
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);
