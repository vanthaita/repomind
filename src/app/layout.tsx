import "@/styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from "next/font/google";
import { type Metadata } from "next";
import { ToastContainer } from 'react-toastify';
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SaaS AI Platform",
  description: "An AI-powered SaaS solution for automation and efficiency.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable}`}>
        <body className="font-sans antialiased bg-neutral-950 text-white scroll-custom">
          <TRPCReactProvider>
            {children}
            <ToastContainer />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
