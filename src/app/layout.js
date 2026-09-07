import localFont from "next/font/local";
import { Archivo_Black } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const gintoUltra = localFont({
  src: "../fonts/ABCGintoNord-Ultra.otf",
  variable: "--font-ginto-ultra",
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
        className={`${gintoUltra.variable} ${archivoBlack.variable} antialiased`}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
