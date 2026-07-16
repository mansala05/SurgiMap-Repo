import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
type Tab = 'customer' | 'pharmacy' | 'admin';
const TABS: {
  key: Tab;
  label: string;
}[] = [
{
  key: 'customer',
  label: 'Customer'
},
{
  key: 'pharmacy',
  label: 'Pharmacy'
},
{
  key: 'admin',
  label: 'Admin'
}];

const TAB_CONFIG: Record<
  Tab,
  {
    heading: string;
    sub: string;
    redirect: string;
  }> =
{
  customer: {
    heading: 'Welcome back',
    sub: 'Sign in to find surgical kits near you.',
    redirect: '/'
  },
  pharmacy: {
    heading: 'Pharmacy portal',
    sub: 'Manage your inventory and stock updates.',
    redirect: '/pharmacy/dashboard'
  },
  admin: {
    heading: 'Admin panel',
    sub: 'Full control over pharmacies and sync operations.',
    redirect: '/admin'
  }
};
export function Login() {
  const [activeTab, setActiveTab] = useState<Tab>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const config = TAB_CONFIG[activeTab];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login — replace with real auth
    setTimeout(() => {
      setLoading(false);
      navigate(config.redirect);
    }, 1000);
  };
  return (
    <div className="min-h-screen bg-iceWhite text-obsidian font-sans flex flex-col">
      {/* Navbar */}
      <nav className="max-w-[1440px] mx-auto w-full px-8 md:px-16 py-8 flex items-center justify-between">
        <a
          href="/"
          className="text-3xl font-black tracking-tighter text-arcticNavy">
          
          surgimap
        </a>
        <a
          href="/"
          className="text-sm font-bold uppercase tracking-widest text-steelBlue hover:text-arcticNavy transition-colors">
          
          ← Back to home
        </a>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo mark */}
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-arcticNavy flex items-center justify-center shadow-lg shadow-arcticNavy/20">
              <ArrowRightIcon
                className="w-8 h-8 text-iceWhite"
                strokeWidth={3} />
              
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-white border border-silverMist rounded-2xl p-1.5 mb-8 gap-1">
            {TABS.map((tab) =>
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab.key ? 'bg-arcticNavy text-iceWhite shadow-md' : 'text-steelBlue hover:text-arcticNavy'}`}>
              
                {tab.label}
              </button>
            )}
          </div>

          {/* Card */}
          <div className="bg-white border border-silverMist rounded-[2rem] p-10 shadow-xl shadow-arcticNavy/5">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tighter text-obsidian mb-2">
                {config.heading}
              </h1>
              <p className="text-steelBlue text-sm font-medium">{config.sub}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-steelBlue mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                  activeTab === 'admin' ?
                  'admin@surgimap.lk' :
                  activeTab === 'pharmacy' ?
                  'pharmacy@example.lk' :
                  'you@example.com'
                  }
                  className="w-full border border-silverMist rounded-xl px-5 py-4 text-base focus:outline-none focus:border-arcticNavy transition-colors placeholder:text-silverMist" />
                
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-steelBlue mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-silverMist rounded-xl px-5 py-4 text-base focus:outline-none focus:border-arcticNavy transition-colors pr-12" />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-steelBlue hover:text-arcticNavy transition-colors">
                    
                    {showPassword ?
                    <EyeOffIcon className="w-5 h-5" /> :

                    <EyeIcon className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs font-bold uppercase tracking-widest text-steelBlue hover:text-arcticNavy transition-colors">
                  
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-arcticNavy text-iceWhite py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-obsidian hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2">
                
                {loading ?
                <>
                    <span className="w-4 h-4 border-2 border-iceWhite/30 border-t-iceWhite rounded-full animate-spin" />
                    Signing in...
                  </> :

                <>
                    Sign in
                    <ArrowRightIcon className="w-4 h-4" strokeWidth={3} />
                  </>
                }
              </button>
            </form>

            {/* Divider */}
            {activeTab === 'customer' &&
            <p className="text-center text-xs text-steelBlue mt-8">
                Don't have an account?{' '}
                <a
                href="#"
                className="font-bold text-arcticNavy hover:underline">
                
                  Sign up free
                </a>
              </p>
            }
            {activeTab === 'pharmacy' &&
            <p className="text-center text-xs text-steelBlue mt-8">
                Want to list your pharmacy?{' '}
                <a
                href="#"
                className="font-bold text-arcticNavy hover:underline">
                
                  Contact us
                </a>
              </p>
            }
          </div>

          {/* Role hint */}
          <p className="text-center text-xs text-steelBlue/60 mt-6 font-medium">
            {activeTab === 'customer' &&
            'Customers can search and find kits near them.'}
            {activeTab === 'pharmacy' &&
            'Pharmacy staff can manage stock and sync inventory.'}
            {activeTab === 'admin' &&
            'Admins have full access to all pharmacies and system logs.'}
          </p>
        </div>
      </div>
    </div>);

}
