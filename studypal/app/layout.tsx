import type { Metadata } from "next";
import TaskBar  from "@/app/components/navigation/taskbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyPal",
  description: "Your personal study helper :D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-white text-black">
        <main className="flex-1 min-h-screen flex flex-col bg-white">
          <TaskBar />
          <div className="min-h-full flex flex-col bg-white">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
