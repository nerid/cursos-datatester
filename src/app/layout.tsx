import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Highlights DataTester - Cultura digital",
  description: "Página de apoyo y material complementario para cursos de Cultura digital.",
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
