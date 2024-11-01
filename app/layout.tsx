import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MicrophoneContextProvider } from "@/context/microphone-context-provider";
import { DeepgramContextProvider } from "@/context/deepgram-context-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Transcription App",
  description: "A web application for transcribing audio using the Deepgram API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MicrophoneContextProvider>
          <DeepgramContextProvider>
            {children}
            <Toaster />
          </DeepgramContextProvider>
        </MicrophoneContextProvider>
      </body>
    </html>
  );
}
