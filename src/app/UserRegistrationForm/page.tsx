'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

const registrationSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone Number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
});

export default function UserRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMap, setShowMap] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      registrationSchema.parse(formData);
      setErrors({});
      setShowMap(true); 
      alert('Form submitted successfully!');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleBack = () => {
    router.push('/login'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4">
      <div className="flex flex-col md:flex-row items-start gap-12 w-full max-w-5xl">
        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 bg-white shadow-2xl border border-blue-100 rounded-2xl w-full max-w-md flex flex-col"
        >
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-700">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            User Registration
          </h1>

          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="off"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="off"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="off"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="off"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoComplete="off"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="w-full mt-2 bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-500 transition"
          >
            Back to Login
          </button>
        </form>

        {/* Divider for large screens */}
        <div className="hidden md:block w-px bg-gray-200 mx-8 h-[500px]" />

        {/* Google Map */}
        {showMap && (
          <div className="mt-8 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Google Map</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                title="Google Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(formData.address)}&z=15&output=embed`}
                className="w-full h-72 rounded-xl border"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}