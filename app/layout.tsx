import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Ganesh Festival Bus Registration",
  description: "Ganesh Festival Bus Registration System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
        <body>
  <LanguageProvider>

    {children}

    <Toaster richColors position="top-right" />

  </LanguageProvider>
</body>
      
    </html>
  );
}