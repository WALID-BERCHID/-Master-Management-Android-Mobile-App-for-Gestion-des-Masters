"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabaseClient";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export function SignInForm() {
  const [status, setStatus] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const supabase = getSupabaseBrowser();
    setStatus("Signing in");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus(error.message);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <Input label="Email" name="email" type="email" placeholder="you@school.org" required />
      <Input label="Password" name="password" type="password" placeholder="Enter your password" required />
      <Button type="submit">Sign in</Button>
      {status && <p className="text-xs text-muted">{status}</p>}
    </form>
  );
}

export function SignUpForm() {
  const [status, setStatus] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("name") || "");
    const supabase = getSupabaseBrowser();
    setStatus("Creating account");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) {
      setStatus(error.message);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <Input label="Full name" name="name" placeholder="Your name" required />
      <Input label="Email" name="email" type="email" placeholder="you@school.org" required />
      <Input label="Password" name="password" type="password" placeholder="Create a password" required />
      <Button type="submit">Create account</Button>
      {status && <p className="text-xs text-muted">{status}</p>}
    </form>
  );
}
