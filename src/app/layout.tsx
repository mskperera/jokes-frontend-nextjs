import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/Navbar"; // Import the Navbar component
import { AuthProvider } from "@/app/context/AuthContext"; // Import AuthProvider
import "./globals.css";

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
    <AuthProvider>
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
          <Navbar />
          <main>{children}</main>
      </body>
    </html>
    </AuthProvider>
  );
}
