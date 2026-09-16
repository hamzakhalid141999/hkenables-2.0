import localFont from "next/font/local";
import { Archivo_Black } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import SmoothScroll from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const gintoBlack = localFont({
  src: "../fonts/ABCGintoNord-Black.otf",
  variable: "--font-ginto-black",
  display: "swap",
});

const gintoUltra = localFont({
  src: "../fonts/ABCGintoNord-Ultra.otf",
  variable: "--font-ginto-ultra",
  display: "swap",
});

const ggSans = localFont({
  src: [
    {
      path: "../fonts/gg-sans/GGSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/gg-sans/GGSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/gg-sans/GGSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/gg-sans/GGSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gg-sans-face",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "HKenables",
  description: "We ship cool stuff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${gintoBlack.variable} ${gintoUltra.variable} ${ggSans.variable} ${archivoBlack.variable} antialiased`}
      >
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
