"use client";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/ui/logo";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-950 to-neutral-900 text-white px-4">
      <div className="flex flex-col items-center mb-8">
        <Logo size="lg" className="mb-3" />
        <p className="text-neutral-300 text-center max-w-md text-base mb-4">AI-powered GitHub insights for developers, teams, and analysts. Sign in to unlock code chat, PR analysis, and more.</p>
        <ul className="flex flex-col gap-2 text-sm text-neutral-300 mb-2 w-full max-w-md">
          <li className="flex items-center gap-2"><span className="inline-block w-4 h-4 text-green-400">✔️</span> Chat with your codebase</li>
          <li className="flex items-center gap-2"><span className="inline-block w-4 h-4 text-green-400">✔️</span> AI-powered PR review</li>
          <li className="flex items-center gap-2"><span className="inline-block w-4 h-4 text-green-400">✔️</span> Secure Google sign-in</li>
          <li className="flex items-center gap-2"><span className="inline-block w-4 h-4 text-green-400">✔️</span> No code download required</li>
        </ul>
      </div>
      <div className="bg-neutral-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center border border-neutral-800">
        <button
          onClick={() => signIn("google", { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-base shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mb-4"
        >
          <img src="/google-color.png" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
        <div className="flex items-center w-full my-4">
          <div className="flex-grow h-px bg-neutral-700" />
          <span className="mx-3 text-neutral-500 text-xs uppercase tracking-wider">or</span>
          <div className="flex-grow h-px bg-neutral-700" />
        </div>
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-800 text-neutral-400 font-semibold rounded-lg border border-neutral-700 cursor-not-allowed mb-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76a6 6 0 11-8.48 8.48 6 6 0 018.48-8.48z" /></svg>
          More sign-in options coming soon
        </button>
        {/* Back to landing page button */}
        <button
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-neutral-700 text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors mb-2"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>
        <div className="mt-4 w-full text-xs text-neutral-500 text-center flex flex-col gap-1">
          <div className="flex items-center justify-center gap-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 19c-4.418 0-8-1.79-8-4V7a4 4 0 018-4 4 4 0 018 4v8c0 2.21-3.582 4-8 4z" /></svg>
            <span>Your data is private and never shared.</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12v1a4 4 0 01-8 0v-1" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v2m0 0h-2m2 0h2" /></svg>
            <span>Need help? <a href="mailto:support@repomind.com" className="underline hover:text-green-400">Contact support</a></span>
          </div>
        </div>
      </div>
      <footer className="mt-8 text-xs text-neutral-500 text-center">
        &copy; {new Date().getFullYear()} RepoMind. All rights reserved.
      </footer>
    </div>
  );
} 