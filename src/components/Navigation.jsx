import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [session, setSession] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Shopee <span className="text-gradient-gold">Affiliate</span>
              </h1>
              <p className="text-slate-400 text-xs font-medium hidden sm:block">Report & Analytics</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              หน้าหลัก
            </Link>
            <Link
              to="/about"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              เกี่ยวกับเรา
            </Link>
            <Link
              to="/pricing"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              ราคา
            </Link>
            {session ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-orange-500/20"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-orange-500/20"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                หน้าหลัก
              </Link>
              <Link
                to="/about"
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                เกี่ยวกับเรา
              </Link>
              <Link
                to="/pricing"
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                ราคา
              </Link>
              {session ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg text-sm font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg text-sm font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
