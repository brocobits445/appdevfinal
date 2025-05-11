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
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Welcome to our Final Project</h1>

      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
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
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password (Your Username)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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

      <p className="mt-4 text-center">
        You have no account?{' '}
        <Link href="/UserRegistrationForm" className="text-blue-500 hover:underline">
          Register Here
        </Link>
      </p>
    </div>
  );
}