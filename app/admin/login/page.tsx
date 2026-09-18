'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AlvericLogo } from '@/components/ui/AlvericLogo';
import { Lock, Mail, AlertCircle, Loader2, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Inner component that uses useSearchParams — must be wrapped in Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authErr || !authData.user) {
        throw new Error(authErr?.message || 'Invalid email or password credentials');
      }

      // Verify user is in admins table
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admins')
        .select('id')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (adminErr || !adminRecord) {
        // Sign out unauthorized user
        await supabase.auth.signOut();
        throw new Error('Access denied. This account does not have administrative privileges.');
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <AlvericLogo variant="dark" size="md" showTagline={false} />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 text-navy-900 text-xs font-bold mt-2">
            <Shield className="w-3.5 h-3.5 text-gold-500" />
            <span>Administrator Access Portal</span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alveric.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-navy-900 text-white font-bold text-sm hover:bg-navy-800 disabled:opacity-50 transition shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Admin Dashboard</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            Protected area. All actions are logged and subject to role-level permissions.
          </p>
        </div>
      </div>
    </div>
  );
}

// Outer page wraps LoginForm in Suspense as required by Next.js for useSearchParams
export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-navy-900" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
