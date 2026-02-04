'use client';

import { useState, useEffect } from 'react';
import { mixpanelService } from '@/lib/mixpanel';

const USER_INFO_STORAGE_KEY = 'userInfoSubmitted';

export default function UserInfoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [adblockerDisabled, setAdblockerDisabled] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    company?: string;
    adblocker?: string;
  }>({});

  useEffect(() => {
    // Check if user info has already been submitted
    const hasSubmitted = localStorage.getItem(USER_INFO_STORAGE_KEY);
    if (!hasSubmitted) {
      setIsOpen(true);
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!adblockerDisabled) {
      newErrors.adblocker = 'Please confirm you have disabled your adblocker';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Set user properties in Mixpanel
    mixpanelService.setUserProperties({
      $email: email,
      $name: name,
      company,
      adblocker_disabled: adblockerDisabled,
      first_seen: new Date().toISOString(),
    });

    // Mark as submitted in localStorage
    localStorage.setItem(USER_INFO_STORAGE_KEY, 'true');

    // Close the modal
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to the Demo
        </h2>
        <p className="text-gray-600 mb-6">
          Please provide your information to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Acme Inc."
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company}</p>
            )}
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="adblocker"
              checked={adblockerDisabled}
              onChange={(e) => setAdblockerDisabled(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="adblocker" className="ml-2 text-sm text-gray-700">
              I have disabled my adblocker for this demo{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.adblocker && (
            <p className="text-red-500 text-sm">{errors.adblocker}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
