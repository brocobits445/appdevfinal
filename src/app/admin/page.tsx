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
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 bg-white shadow-md rounded w-96">
        <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Admin Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <button
          onClick={handleAdminAccess}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Access Admin Page
        </button>

        <button
          onClick={handleBackToLogin}
          className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}