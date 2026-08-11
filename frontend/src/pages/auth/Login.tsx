import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, EyeIcon, EyeOffIcon, ShieldCheckIcon } from 'lucide-react';
import { loginPharmacy } from '../../lib/api';
import { savePharmacySession } from '../../lib/pharmacySession';

type LoginLocationState = { from?: string; message?: string } | null;

export function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LoginLocationState;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const session = await loginPharmacy(email, password);
      savePharmacySession(session);
      navigate(state?.from || '/pharmacy/dashboard', { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = () => {
    setEmail('pharmacy@surgimap.lk');
    setPassword('pharmacy123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-iceWhite text-obsidian font-sans flex flex-col">
      <nav className="max-w-[1440px] mx-auto w-full px-6 md:px-16 py-8 flex items-center justify-between">
        <Link to="/" className="text-3xl font-black tracking-tighter text-arcticNavy">surgimap</Link>
        <Link to="/" className="text-sm font-bold uppercase tracking-widest text-steelBlue hover:text-arcticNavy transition-colors">
          ← Back to home
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-arcticNavy flex items-center justify-center shadow-lg shadow-arcticNavy/20">
              <ShieldCheckIcon className="w-8 h-8 text-iceWhite" strokeWidth={2.5} />
            </div>
          </div>

          <div className="bg-white border border-silverMist rounded-[2rem] p-8 md:p-10 shadow-xl shadow-arcticNavy/5">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-steelBlue mb-3">Staff access</p>
              <h1 className="text-3xl font-black tracking-tighter text-obsidian mb-2">Pharmacy portal</h1>
              <p className="text-steelBlue text-sm font-medium">Sign in to monitor synced pharmacy inventory.</p>
            </div>

            {state?.message && (
              <div className="mb-5 rounded-xl bg-glacierBlue/20 border border-glacierBlue px-4 py-3 text-sm font-semibold text-arcticNavy">
                {state.message}
              </div>
            )}
            {error && (
              <div role="alert" className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="pharmacy-email" className="block text-xs font-bold uppercase tracking-widest text-steelBlue mb-2">Email address</label>
                <input
                  id="pharmacy-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="pharmacy@surgimap.lk"
                  className="w-full border border-silverMist rounded-xl px-5 py-4 text-base focus:outline-none focus:border-arcticNavy transition-colors placeholder:text-silverMist"
                />
              </div>

              <div>
                <label htmlFor="pharmacy-password" className="block text-xs font-bold uppercase tracking-widest text-steelBlue mb-2">Password</label>
                <div className="relative">
                  <input
                    id="pharmacy-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-silverMist rounded-xl px-5 py-4 pr-12 text-base focus:outline-none focus:border-arcticNavy transition-colors placeholder:text-silverMist"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-steelBlue hover:text-arcticNavy transition-colors"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-arcticNavy text-iceWhite py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-obsidian hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><span className="w-4 h-4 border-2 border-iceWhite/30 border-t-iceWhite rounded-full animate-spin" />Signing in…</> : <>Sign in<ArrowRightIcon className="w-4 h-4" strokeWidth={3} /></>}
              </button>
            </form>

            <div className="mt-7 pt-6 border-t border-silverMist text-center">
              <p className="text-xs text-steelBlue mb-3">Local demo account</p>
              <button type="button" onClick={useDemoAccount} className="text-xs font-black uppercase tracking-widest text-arcticNavy hover:underline">
                Fill demo credentials
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
