import type { Metadata } from "next";
import { Old_Standard_TT, Inter } from "next/font/google";
import "./globals.css";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const oldStandardTT = Old_Standard_TT({
  variable: "--font-old-standard-tt",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-gt-america",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blackant Studio — Creative Agency",
  description:
    "Blackant adalah studio kreatif yang menghadirkan visual, strategi, dan kampanye yang meninggalkan kesan — bukan hanya tayangan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${oldStandardTT.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#000000]">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

