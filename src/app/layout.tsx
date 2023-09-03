import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Kumbh_Sans } from "next/font/google";

import { Toaster } from "@components/basic/toast";
import { Container } from "@components/layout/container";
import { Footer } from "@components/layout/footer";
import { Navbar } from "@components/layout/navbar";

import { Providers } from "./providers";

import type { Metadata } from "next";

const font = Kumbh_Sans({ subsets: ["latin"] });

export const siteConfig = {
  name: "Split3",
  description: "Manage your group expenses w/ crypto",
  url: "https://localhost:3000",
  ogImage: "https://localhost:3000/og.jpg",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@myhandle",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pb-20">
              <Container>{children}</Container>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
