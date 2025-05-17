'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAdminAccess = () => {
    const isAdmin = email.trim().toLowerCase() === 'admin@example.com';

    if (isAdmin) {
      router.push('/'); 
    } else {
      setError('Access denied. Only admins can access this page directly.');
    }
  };

  const handleBackToLogin = () => {
    router.push('/login'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4">
      <div className="p-8 bg-white shadow-2xl border border-blue-100 rounded-2xl w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-green-700">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v3h16v-3c0-2.663-5.33-4-8-4z" /></svg>
          Admin Access
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-6 w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Admin Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-300"
            required
            autoComplete="off"
          />
        </div>
        <button
          onClick={handleAdminAccess}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-green-700 transition"
        >
          Access Admin Page
        </button>

        <button
          onClick={handleBackToLogin}
          className="w-full mt-2 bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-500 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}