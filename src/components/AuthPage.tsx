import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../integrations/supabase/client";
import { Leaf, Envelope, Lock, Eye, EyeSlash, User, SignIn, CheckCircle, XCircle, Spinner } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
        toast.success("Account created! Check your email for confirmation.");
        setIsSignUp(false);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 shadow-lg">
            <Leaf size={28} weight="fill" className="text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-emerald-900">
            AgriTrack
          </h1>
          <p className="mt-1 text-sm text-emerald-600">
            {isSignUp ? "Create your farm management account" : "Sign in to your farm dashboard"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-emerald-800">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Chidi Okonkwo"
                    required
                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 py-2.5 pl-9 pr-3 text-sm text-emerald-900 placeholder-emerald-300 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-emerald-800">
                Email Address
              </label>
              <div className="relative">
                <Envelope size={16} weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  required
                  className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 py-2.5 pl-9 pr-3 text-sm text-emerald-900 placeholder-emerald-300 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-emerald-800">
                Password
              </label>
              <div className="relative">
                <Lock size={16} weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 py-2.5 pl-9 pr-10 text-sm text-emerald-900 placeholder-emerald-300 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700"
              >
                <XCircle size={16} weight="fill" className="shrink-0 text-red-500" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:from-emerald-700 hover:to-green-600 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isSignUp ? <User size={16} /> : <SignIn size={16} />}
                  {isSignUp ? "Create Account" : "Sign In"}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-emerald-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
              >
                {isSignUp ? "Sign In" : "Create one"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}