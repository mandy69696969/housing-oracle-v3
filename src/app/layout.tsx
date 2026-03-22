import type { Metadata } from "next";
import { Instrument_Serif, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({ 
  weight: "400", 
  subsets: ["latin"], 
  variable: "--font-instrument",
  display: "swap"
});
const dmMono = DM_Mono({ 
  weight: ["400", "500"], 
  subsets: ["latin"], 
  variable: "--font-dm-mono",
  display: "swap"
});
const dmSans = DM_Sans({ 
  weight: ["300", "400", "500"], 
  subsets: ["latin"], 
  variable: "--font-dm-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "HOUSING ORACLE — AI Real Estate Intelligence",
  description: "Institutional-grade real estate analysis powered by live data, ML models, and Claude AI",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrument.variable} ${dmMono.variable} ${dmSans.variable} h-full`}>
      <body className="antialiased min-h-full">
        {children}
      </body>
    </html>
  );
}
