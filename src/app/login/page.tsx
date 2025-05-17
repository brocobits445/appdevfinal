'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch users.');
      const users: User[] = await response.json();
      const user = users.find((u) => u.email === email);

      if (!user || user.username !== password) {
        setError('Invalid email or password.');
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      router.push('/user');
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4">
      <div className="flex flex-col items-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-700">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          Welcome to our Final Project
        </h1>

        <form onSubmit={handleLogin} className="p-8 bg-white shadow-2xl border border-blue-100 rounded-2xl w-full flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password (Your Username)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center">
          Are you an admin?{' '}
          <Link href="/admin" className="text-blue-500 hover:underline">
            Access Admin Page
          </Link>
        </p>

        <p className="mt-2 text-center">
          You have no account?{' '}
          <Link href="/UserRegistrationForm" className="text-blue-500 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}