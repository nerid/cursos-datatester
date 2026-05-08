"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[var(--color-hornette-bg)] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[var(--color-hornette-primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
