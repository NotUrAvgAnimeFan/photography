import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";


const cormorantGaramond = Cormorant_Garamond({
  weight: '500',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Ricardo's Photography Portfolio",
  description: "A showcase of my photography work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.className} antialiased`}
      >
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
