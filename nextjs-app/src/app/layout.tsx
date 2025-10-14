import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrimaryNav } from "@/components/navigation/PrimaryNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClinicCases Next",
  description: "Progressively modernizing the ClinicCases interface with Next.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100`}> 
        <div className="flex min-h-screen flex-col lg:flex-row">
          <aside className="border-b border-slate-800 bg-slate-900/70 p-6 shadow-lg lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
            <PrimaryNav />
          </aside>
          <main className="flex-1 bg-slate-950/60 p-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
