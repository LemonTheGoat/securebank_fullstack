import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Eye,
  Quote
} from 'lucide-react';

// --- Placeholder Data for Testimonials ---
const testimonials = {
  individuals: [
    {
      id: 1,
      quote: "Tracking my daily expenses with SecureBank is just like being in a strict cal def. It takes discipline, but the long-term gains are undeniable. Gotta stay shredded financially.",
      author: "Louis Timbal"
    },
    {
      id: 2,
      quote: "The app is so smooth and painless to use, which is an absolute lifesaver on days when my dysmenorrhea is acting up and I can't even leave my bed to go to a physical branch.",
      author: "Myles Whatton"
    },
    {
      id: 3,
      quote: "The UI is clean, the transfers are instant, and my money is secure. But seriously, can someone please just tell me who Jalen Brunson is?",
      author: "Jimuel Billones"
    }
  ],
  businesses: [
    {
      id: 4,
      quote: "SecureBank has streamlined our payroll and daily operational expenses. The corporate tools are intuitive and save us hours each week.",
      author: "Marcus V."
    },
    {
      id: 5,
      quote: "The business integration features allow us to connect our accounting software directly. It has completely transformed our cash flow tracking.",
      author: "Alice W."
    },
    {
      id: 6,
      quote: "Excellent merchant services and responsive support. SecureBank truly understands the agility required to run a growing enterprise.",
      author: "David K."
    }
  ]
};

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('liam@bank.local');
  const [password, setPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('individuals');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-emerald-500/30">
      
      {/* FLOATING NAVBAR */}
      <div className="px-4 pt-6 sm:px-8">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-slate-800 bg-slate-900/80 px-6 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <span className="text-lg font-bold tracking-tight text-white">SecureBank</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">Home</a>
            <a href="#" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">Careers</a>
            <a href="#" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">About</a>
            <a href="#" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">Security</a>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">Sign Up</a>
            <button className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900">
              Login
            </button>
          </div>

          <button 
            className="text-slate-300 hover:text-white focus:outline-none md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 top-24 z-50 w-full px-4 md:hidden">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl backdrop-blur-md">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-sm font-medium text-slate-300 hover:text-emerald-500">Home</a>
              <a href="#" className="text-sm font-medium text-slate-300 hover:text-emerald-500">Careers</a>
              <a href="#" className="text-sm font-medium text-slate-300 hover:text-emerald-500">About</a>
              <a href="#" className="text-sm font-medium text-slate-300 hover:text-emerald-500">Security</a>
              <hr className="border-slate-800" />
              <a href="#" className="text-sm font-medium text-slate-300 hover:text-white">Sign Up</a>
              <button className="rounded-full bg-emerald-500 px-6 py-2.5 text-center text-sm font-semibold text-slate-950">
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO & LOGIN SECTION */}
      <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900/60 px-6 py-16 shadow-2xl backdrop-blur-sm sm:px-12 sm:py-20">
          
          {/* Subtle Dot Pattern overlay (top right) */}
          <div className="absolute right-0 top-0 -z-10 h-64 w-64 opacity-20" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '16px 16px', maskImage: 'radial-gradient(circle, black, transparent)' }}></div>

          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-4xl font-bold tracking-tight text-emerald-500 sm:text-5xl">Login</h1>
            <p className="mt-4 text-sm text-slate-400">
              Welcome back! Please log in to access your account.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
              
              {/* Inputs (Side by side on desktop) */}
              <div className="flex w-full flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-5 py-3.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Password"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3.5 pl-5 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Eye className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <a href="#" className="text-sm font-medium text-slate-300 underline decoration-slate-500 underline-offset-4 hover:text-white">
                Forgot Password?
              </a>

              <div className="w-full max-w-sm space-y-3">
                <button
                  type="submit"
                  className="w-full rounded-full bg-emerald-500 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Login
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border border-slate-800 bg-slate-950 py-3.5 text-sm font-medium text-white transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Sign Up
                </button>
              </div>

              {/* Social Login */}
              <div className="w-full max-w-sm pt-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <span className="relative bg-slate-900/60 px-4 text-xs font-medium text-slate-500">Or Continue with</span>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                  <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-emerald-500 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10">
                    <span className="text-lg font-bold">G</span>
                  </button>
                  <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-emerald-500 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10">
                    <span className="text-lg font-bold">f</span>
                  </button>
                  <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-emerald-500 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10">
                    <span className="text-xl font-bold"></span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </main>

      {/* TESTIMONIALS SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our <span className="text-emerald-500">Testimonials</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Hear what individuals and businesses have to say about their banking experience with SecureBank.
            </p>
          </div>

          <div className="flex shrink-0 rounded-full border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => setActiveTab('individuals')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === 'individuals' 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Individuals
            </button>
            <button
              onClick={() => setActiveTab('businesses')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === 'businesses' 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Businesses
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials[activeTab].map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="flex h-full flex-col items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center transition-opacity animate-in fade-in duration-300"
            >
              <div className="flex flex-col items-center">
                <Quote className="h-10 w-10 text-emerald-500" fill="currentColor" />
                <p className="mt-6 text-sm leading-relaxed text-slate-300">
                  {testimonial.quote}
                </p>
              </div>
              <div className="mt-8">
                <p className="text-sm font-semibold text-emerald-500">{testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
           <p className="text-xs text-slate-600">Sample testimonials shown as placeholder content, not verified customer statements.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-slate-800/50 pb-12 pt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4">
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-500" />
            <span className="text-xl font-bold tracking-tight text-white">SecureBank</span>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-10">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white">Home</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white">Careers</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white">About</a>
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white">Security</a>
          </div>

          <div className="mt-10 w-full border-t border-slate-800/50 pt-8">
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>hello@securebank.example</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+63 900 000 0000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Your Address, City, Country</span>
              </div>
            </div>
          </div>

          {/* Bottom Floating Pill */}
          <div className="mt-10 flex w-full flex-col items-center justify-between gap-6 rounded-full border border-slate-800 bg-slate-900/40 px-6 py-4 md:flex-row">
            <div className="flex gap-3">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400">f</a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400">X</a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400">in</a>
            </div>
            
            <p className="text-xs text-slate-500">
              © 2026 SecureBank. All rights reserved.
            </p>
            
            <div className="flex gap-4 text-xs font-medium text-slate-500">
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <span className="text-slate-700">|</span>
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}