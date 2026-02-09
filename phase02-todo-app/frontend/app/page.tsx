'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  // Initialize theme
  useEffect(() => {
    // Check system preference or localStorage, default to dark
    if (localStorage.theme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark theme
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-blue-900/30 rounded-full blur-3xl opacity-80 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 rounded-full blur-3xl opacity-80 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-indigo-900/30 via-blue-900/30 to-purple-900/30 rounded-full blur-3xl opacity-80 animate-pulse animation-delay-4000"></div>

        {/* Shiny overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80"></div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            TaskMaster
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-gray-800/50 transition-colors duration-300 p-3 backdrop-blur-sm border border-gray-700/50"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </Button>
          {session.data ? (
            <Link href="/dashboard">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 px-6 py-2 font-medium hover:scale-105"
              >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border border-gray-700 text-gray-300 hover:bg-gray-800/50 px-6 py-2 font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 px-6 py-2 font-medium hover:scale-105"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-6 py-2 mb-6 text-sm text-indigo-400 bg-indigo-900/30 backdrop-blur-sm rounded-full border border-indigo-800/50">
            Productivity Redefined
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Master Your Day with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">TaskMaster</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Designed to help you achieve more with less stress
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-10 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 rounded-xl hover:scale-105 backdrop-blur-sm"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="px-10 py-6 text-lg border border-gray-700 text-gray-300 hover:bg-gray-800/50 transition-all duration-300 rounded-xl hover:scale-105 backdrop-blur-sm"
              >
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-lg shadow-black/20">
            <div className="text-4xl font-bold text-indigo-400 mb-2">98%</div>
            <div className="text-gray-400">User Satisfaction</div>
          </div>
          <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-lg shadow-black/20">
            <div className="text-4xl font-bold text-indigo-400 mb-2">24/7</div>
            <div className="text-gray-400">Support Available</div>
          </div>
          <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-lg shadow-black/20">
            <div className="text-4xl font-bold text-indigo-400 mb-2">10K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-10 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center shadow-lg border border-blue-800/30 backdrop-blur-sm">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-100">Organize</h3>
            <p className="text-gray-400 text-center">
              Keep all your tasks in one place with our intuitive organization system
            </p>
          </Card>

          <Card className="p-10 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center shadow-lg border border-purple-800/30 backdrop-blur-sm">
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-100">Prioritize</h3>
            <p className="text-gray-400 text-center">
              Focus on what matters most with smart priority management
            </p>
          </Card>

          <Card className="p-10 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-green-900/50 to-emerald-900/50 flex items-center justify-center shadow-lg border border-green-800/30 backdrop-blur-sm">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-100">Achieve</h3>
            <p className="text-gray-400 text-center">
              Reach your goals with our productivity tracking and completion system
            </p>
          </Card>
        </div>

        {/* Testimonial Section */}
        <div className="max-w-3xl mx-auto mt-24 p-10 bg-gray-900/60 backdrop-blur-sm rounded-3xl border border-gray-800/50 shadow-xl shadow-black/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-purple-900/10"></div>
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="text-6xl mb-6 text-indigo-400/50">❝</div>
            <p className="text-xl text-gray-300 mb-8 italic">
              "TaskMaster has completely transformed how I manage my daily tasks. I'm more productive and less stressed than ever before. The interface is intuitive and the features are powerful!"
            </p>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg shadow-indigo-500/20">
                UR
              </div>
              <div>
                <div className="font-bold text-lg text-gray-100">Ubaid Raza</div>
                <div className="text-gray-500">Product Manager</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 relative z-10">
        <p>© 2026 TaskMaster. All rights reserved.</p>
      </footer>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        .animate-pulse {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}