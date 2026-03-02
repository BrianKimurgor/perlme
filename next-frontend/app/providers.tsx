"use client";

import { store } from "@/store/store";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
