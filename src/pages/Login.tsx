import { useState } from 'react';
import { Eye, ArrowLeft, ArrowRight, Mail, Lock, User } from 'lucide-react';
import Doodles from '@/components/Doodles';

interface Props {
  onLogin: (name: string) => void;
  onBack: () => void;
}

export default function Login({ onLogin, onBack }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const displayName = mode === 'signup' ? name : email.split('@')[0];
      onLogin(displayName.charAt(0).toUpperCase() + displayName.slice(1));
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden border-r border-white/[0.06]">
        {/* Floating doodles */}
        <Doodles />

        {/* Ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </button>

          <div>
            <div className="flex items-center gap-2 mb-8">
              <Eye className="w-8 h-8 text-sky-400" strokeWidth={2.5} />
              <span className="text-2xl font-semibold tracking-tight">
                Biz<span className="text-sky-400">Eye</span>
              </span>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-6">
              <span className="text-white">Intelligence</span>
              <br />
              <span className="text-gray-500">Begins Here.</span>
            </h2>
            <p className="text-gray-500 max-w-md leading-relaxed">
              Sign in to access your business intelligence dashboard. Upload data, get insights, and act before your competitors do.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-600">
            <span>v1.5</span>
            <span>·</span>
            <span>AI-Powered BI for D2C</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative">
        {/* Doodles on form side too */}
        <Doodles className="opacity-50" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile back button */}
          <button onClick={onBack} className="lg:hidden flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <Eye className="w-7 h-7 text-sky-400" strokeWidth={2.5} />
            <span className="text-xl font-semibold tracking-tight">
              Biz<span className="text-sky-400">Eye</span>
            </span>
          </div>

          <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-4 font-medium">
            {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
          </p>
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'signin' ? 'Sign in to BizEye' : 'Create your account'}
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            {mode === 'signin'
              ? 'Enter your credentials to access your dashboard.'
              : 'Start seeing your business clearly in under 10 seconds.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs text-gray-400 mb-2 tracking-wide uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-2 tracking-wide uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2 tracking-wide uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/50 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">{error}</p>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-sky-400 focus:ring-sky-400/30" />
                  <span className="text-xs">Remember me</span>
                </label>
                <button type="button" className="text-sky-400 text-xs hover:text-sky-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-3 bg-sky-400 text-black font-semibold py-4 rounded-xl hover:bg-sky-300 transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-widest text-sm">
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 bg-sky-400/5 border border-sky-400/10 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-gray-500">
              <span className="text-sky-400 font-medium">Demo mode</span> — enter any email & password (4+ chars) to continue
            </p>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
