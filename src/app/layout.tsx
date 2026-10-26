import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CONCEPTFLOW — Visual Number Systems & Conversion Engine",
  description: "Don't just memorize conversions. See how they work. Interactive step-by-step visualizer for Binary, Octal, Decimal, and Hexadecimal with tactile bit-flipping and practice challenges.",
  keywords: ["number systems", "binary converter", "hexadecimal", "octal", "computer science visualizer", "interactive math", "learn binary"],
  authors: [{ name: "Nandita Ghosh", url: "https://github.com/nanditaghosh01" }],
  creator: "Nandita Ghosh",
  publisher: "Nandita Ghosh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
