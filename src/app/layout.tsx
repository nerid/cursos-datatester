import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: 'Cultura digital – Highlights de cursos',
  description: 'Página de apoyo con los contenidos destacados de los cursos de cultura digital impartidos por Benjamín Quintero.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-[var(--color-hornette-bg)] text-[var(--color-hornette-text)] min-h-screen selection:bg-[var(--color-hornette-primary)] selection:text-black">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
