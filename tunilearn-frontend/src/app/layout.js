import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TuniLearn - Premier Tunisian Learning Platform",
  description: "Learn, grow, and excel with TuniLearn. High-quality courses in Arabic, French, and English from expert Tunisian instructors.",
};

import RoleNavbar from "./components/RoleNavbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <RoleNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
