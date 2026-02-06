import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "IEP Prep",
  description: "Prepare for IEP meetings with structured minutes and task follow ups."
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/students", label: "Students" },
  { href: "/meetings", label: "Meetings" },
  { href: "/tasks", label: "Tasks" },
  { href: "/templates", label: "Templates" },
  { href: "/settings", label: "Settings" }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <div className="relative overflow-hidden">
          <div className="corner-blob -top-20 -left-20" />
          <div className="corner-blob -bottom-32 right-6" />
          <header className="border-b border-border bg-surface/80 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between px-6 py-5">
              <div>
                <Link href="/dashboard" className="text-2xl font-semibold gradient-text">
                  IEP Prep
                </Link>
                <p className="text-sm text-muted">Meeting prep, minutes, and follow ups</p>
              </div>
              <nav className="flex gap-4 text-sm text-muted">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-text transition">
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex gap-2">
                <Link href="/sign-in" className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-text">
                  Sign in
                </Link>
                <Link href="/sign-up" className="rounded-full px-4 py-2 text-sm button-primary shadow-soft">
                  Create account
                </Link>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
