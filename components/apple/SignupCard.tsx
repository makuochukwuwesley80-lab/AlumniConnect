"use client";

import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import GlassCard from "./GlassCard";
import GlassInput from "./GlassInput";
import GlassButton from "./GlassButton";
import Logo from "./Logo";

import { supabase } from "@/lib/supabase/client";

export default function SignupCard() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFirstName || !cleanLastName) {
      setError("Please enter your first and last name.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              first_name: cleanFirstName,
              last_name: cleanLastName,
            },
          },
        });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session && data.user) {
        setSuccess(
          "Account created successfully. Opening your AlumniConnect dashboard..."
        );

        router.push("/dashboard");
        router.refresh();
        return;
      }

      setSuccess(
        "Account created! Please check your email to confirm your AlumniConnect account."
      );
    } catch {
      setError(
        "Something went wrong while creating your account. Please try again."
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
        <div className="mb-7 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Join AlumniConnect
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create your alumni account and reconnect with your community.
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
                Sign up failed
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
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <GlassInput
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={(event) =>
                setFirstName(event.target.value)
              }
              placeholder="First name"
              autoComplete="given-name"
              icon={<User size={20} />}
              required
              disabled={loading}
            />

            <GlassInput
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={(event) =>
                setLastName(event.target.value)
              }
              placeholder="Last name"
              autoComplete="family-name"
              icon={<User size={20} />}
              required
              disabled={loading}
            />
          </div>

          <GlassInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
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
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Create password"
            autoComplete="new-password"
            icon={<Lock size={20} />}
            required
            disabled={loading}
          />

          <GlassInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            placeholder="Confirm password"
            autoComplete="new-password"
            icon={<Lock size={20} />}
            required
            disabled={loading}
          />

          <GlassButton
            type="submit"
            loading={loading}
            disabled={
              !firstName ||
              !lastName ||
              !email ||
              !password ||
              !confirmPassword
            }
          >
            <span>
              {loading ? "Creating account..." : "Create account"}
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
            Alumni community
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            Reconnect. Network. Grow together.
          </p>
        </div>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-sky-600 transition hover:text-blue-600"
          >
            Sign in
          </Link>
        </p>
      </GlassCard>
    </motion.div>
  );
}
