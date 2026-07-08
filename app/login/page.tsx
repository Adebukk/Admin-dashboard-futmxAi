"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // const staffEmailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@futminna\.edu\.ng$/ ;
    const studentEmailRegex=  /^[a-zA-Z]+\.[a-zA-Z0-9]+@st.futminna\.edu\.ng$/ 
    if (!studentEmailRegex.test(email)) {
      setLoading(false);
      toast.error("Email must be in the format staff.name@futminna.edu.ng");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Welcome back, Admin!");
      router.push("/dashboard"); // Go to dashboard
    } catch (error: any) {
      // console.error("Login error: ", error);
      let errorMessage = "Failed to Login in. Please check you credentials";
      if (
        error.code === "auth/invalid/credential" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Invalid email or password";
      } else if ((error.code = "auth/too-many-requests")) {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white p-10  rounded-3xl shadow-sm border">
        <div className="text-center mb-2">
          <div className="inline-block p-4 bg-[#0f46ac] -100 rounded-2xl mb-4">
            <Lock className="w-6 h-6 text-[#ffffff]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f46ac]">FUTMINNA <br /> Admin Login</h1>
          {/* <p className="text-slate-500 text-sm mt-2">Eng Assist Handbook Portal</p> */}
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 input: text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0f46acc9] -400 transition placeholder:text-slate-200"
                placeholder="staff.name@futminna.edu.ng"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-slate-700 bg-slate-50 border  border-slate-200 rounded-xl outline-none placeholder:text-slate-200 focus:border-[#0f46acc9] -400 transition"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f46ac] text-white py-3 rounded-xl font-semibold hover:bg-[#0f46acc9]  transition disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
        <div className="flex items-center justify-center mt-6">
          <p className="text-sm text-slate-600">
            Dont have an account?{" "}
            <Link
              href="/signup"
              className="text-[#0f46ac] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
