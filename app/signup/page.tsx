'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // MOCK DELAY: Pretend we are creating an account on a server for 1.5 seconds
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Account created successfully!');
    router.push('/login'); // Send them back to login page
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] -100  to-slate-100 px-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-sm border    ">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-[#0f46ac] -100 rounded-2xl mb-4">
            <UserPlus className="w-6 h-6 text-[#ffffff] " />
          </div>
          <h1 className="text-3xl font-bold text-[#0f46ac]">Create Account</h1>
          <p className="text-slate-500 text-sm mt-2">Register as Department Admin</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none border-[#0f46acc9] -400 transition
                input: text-slate-700"
                // placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className ="w-full pl-11 pr-4 py-3 input: text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none border-[#0f46acc9] -400 transition placeholder:text-slate-400" placeholder="staff.name@futminna.edu.ng" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none border-[#0f46acc9] -400 transition
                input: text-slate-700"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f46ac] text-white py-3 rounded-xl font-semibold hover:bg-[#0f46acc9] transition disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0f46ac] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}