import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DesktopMessage from "./DesktopMessage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ArtSensei",
  description: "Your AI-powered art companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-[100dvh] overflow-hidden`}
      >
        {/* Desktop/Tablet Warning - Hidden on mobile */}
        <div className="block sm:hidden h-[100dvh] overflow-hidden">
          {children}
        </div>
        
        {/* Show message on tablets and desktops */}
        <div className="hidden sm:block h-[100dvh] overflow-hidden">
          <DesktopMessage />
        </div>
      </body>
    </html>
  );
}