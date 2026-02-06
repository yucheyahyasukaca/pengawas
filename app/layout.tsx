import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { VersionChecker } from "@/components/ui/version-checker";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    "MKPS",
    "Pengawas",
    "SMA",
    "SLB",
    "Provinsi Jawa Tengah",
    "Supervisi",
    "Kepengawasan",
  ],
  authors: [{ name: "MKPS SMA & SLB Provinsi Jawa Tengah" }],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
  metadataBase: new URL("https://sip-kepengawasanjateng.id"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          jetbrainsMono.variable,
        )}
      >
        <Providers>
          <VersionChecker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
