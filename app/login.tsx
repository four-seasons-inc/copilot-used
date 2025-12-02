"use client";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    signIn("azure-ad", {
      callbackUrl: "/",
      redirect: true,
    });
  }, []);

  return null;
}
