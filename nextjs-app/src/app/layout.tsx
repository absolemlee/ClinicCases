import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClinicCases",
  description: "Legal Case Management System",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-gray-950">
      <body className={`${inter.className} min-h-screen bg-gray-950 text-gray-100 antialiased`}> 
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-900">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
