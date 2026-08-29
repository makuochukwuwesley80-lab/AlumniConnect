"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import GlassCard from "./GlassCard";
import GlassInput from "./GlassInput";
import GlassButton from "./GlassButton";
import Logo from "./Logo";

import { supabase } from "@/lib/supabase/client";

export default function LoginCard() {
  const router = useRouter();

  const [email, setEmail] = useState("alu2026001@alumniconnect.app");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError("Login succeeded, but no user account was returned.");
        return;
      }

      setSuccess("Login successful. Opening your AlumniConnect dashboard...");

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "Something went wrong while connecting to AlumniConnect. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: "easeOut",
      }}
      className="w-full max-w-md"
    >
      <GlassCard
        hover={false}
        className="p-7 sm:p-9"
      >
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in with your AlumniConnect account.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700"
          >
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Sign in failed
              </p>

              <p className="mt-1 leading-5">
                {error}
              </p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700"
          >
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <p className="font-medium leading-5">
              {success}
            </p>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <GlassInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="AlumniConnect email"
            autoComplete="email"
            icon={<Mail size={20} />}
            required
            disabled={loading}
          />

          <GlassInput
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            icon={<Lock size={20} />}
            required
            disabled={loading}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-semibold text-sky-600 transition hover:text-blue-600"
            >
              Forgot password?
            </button>
          </div>

          <GlassButton
            type="submit"
            loading={loading}
            disabled={!email || !password}
          >
            <span>
              {loading ? "Signing in..." : "Sign in"}
            </span>

            {!loading && <ArrowRight size={19} />}
          </GlassButton>
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-300/60" />

          <span className="text-xs font-medium text-slate-400">
            ALUMNICONNECT
          </span>

          <div className="h-px flex-1 bg-slate-300/60" />
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-sky-500">
            Alumni email
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-slate-700">
            alu2026001@alumniconnect.app
          </p>
        </div>

        <p className="mt-7 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-sky-600 transition hover:text-blue-600"
          >
            Create one
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-slate-400">
          Your AlumniConnect account is secured by Supabase.
        </p>
      </GlassCard>
    </motion.div>
  );
}


