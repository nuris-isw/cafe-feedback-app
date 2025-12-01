'use client';

import { useState } from 'react';
// Import klien Supabase yang aware terhadap cookies di browser
import { supabaseBrowser } from '@/lib/supabaseBrowser'; 
import { useRouter } from 'next/navigation';
import React from 'react'; // Tambahkan React import untuk komponen/hooks

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Gunakan 'error' untuk pesan kegagalan
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // --- LOGIKA KONEKSI NYATA ---
    const { data, error: authError } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // Jika terjadi error (misal: kredensial salah)
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Jika berhasil, Supabase Auth Helpers secara otomatis mengatur cookies
    if (data.user) {
      // Arahkan ke Dashboard Admin
      router.push('/admin'); 
    }
    // --- AKHIR KONEKSI NYATA ---
    
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">🔑 Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Admin</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">Error: {error}</p>
        )}
      </div>
    </div>
  );
}