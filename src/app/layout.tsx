import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import HandleClick from "@/lib/utils/HandleClick";
import { Navbar } from "@/components/layout";
import { SpeedInsights } from '@vercel/speed-insights/next';
import favicon from '../../public/favicon/favicon.ico';
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Movie Review",
  description: "Reivew any movie you like",
  icons: [{ rel: "icon", url: favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
        <body suppressHydrationWarning>
          <Navbar />
          <HandleClick />
          {children}
          <SpeedInsights />
        <Toaster/>
        </body>
      </html>
    </ClerkProvider>
  );
}
