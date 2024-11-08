import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar"; // Import the Navbar component
import "./globals.css";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

// Local font configuration
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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        {/* <ProgressBar
          height="4px"
          color="#fffd00" // Adjust the color to your preference
          options={{ showSpinner: false }} // Hides the spinner
          shallowRouting // Enable shallow routing to not reload the page
        /> */}

        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}