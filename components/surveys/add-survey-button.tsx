"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";

export function AddSurveyButton() {
  const { user } = useAuth();

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
      }}
    >
      <Button
        size="lg"
        className="rounded-full w-16 h-16 bg-gold hover:bg-gold/90 text-indigo shadow-lg"
        style={{
          backgroundColor: "#f5b52e",
          color: "#1f0d61",
          borderRadius: "9999px",
          width: "64px",
          height: "64px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
        asChild
      >
        <Link
          href={user ? "/surveys/create" : "/login?redirect=/surveys/create"}
          aria-label="Create new survey"
        >
          <Plus className="h-8 w-8" />
        </Link>
      </Button>
    </div>
  );
}
