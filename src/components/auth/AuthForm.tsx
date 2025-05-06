// src/components/auth/AuthForm.tsx
'use client'; // This component uses client-side interactivity (useState, event handlers)

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// import { UserRole } from '@prisma/client'; // Import your UserRole enum

// Define a client-side representation of the roles
// These string values MUST match the values in your Prisma UserRole enum
enum ClientUserRole {
    JOB_SEEKER = 'JOB_SEEKER',
    EMPLOYER = 'EMPLOYER',
    // ADMIN = 'ADMIN', // If you were to add it
}

interface AuthFormProps {
  mode: 'login' | 'register';
  apiEndpoint: string;
  successRedirectPath?: string; // Optional: where to redirect on success
  onSuccessMessage?: string; // Optional: message to show on success if not redirecting
}

// Define a more specific type for the payload
interface AuthPayload {
    email: string;
    password: string;
    name?: string; // Optional for login
    role?: ClientUserRole; // Optional for login
}

export default function AuthForm({
  mode,
  apiEndpoint,
  successRedirectPath,
  onSuccessMessage,
}: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  const [role, setRole] = useState<ClientUserRole>(ClientUserRole.JOB_SEEKER); // Default role for registration
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const payload: AuthPayload = { email, password };
    if (mode === 'register') {
      payload.name = name;
      payload.role = role;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Handle success
      if (successRedirectPath) {
        router.push(successRedirectPath);
      } else if (onSuccessMessage) {
        setSuccessMessage(onSuccessMessage);
        // Clear form on successful registration if not redirecting
        if (mode === 'register') {
            setEmail('');
            setPassword('');
            setName('');
            setRole(ClientUserRole.JOB_SEEKER);
        }
      } else {
        // Default success action if none specified (e.g., for login with redirect handled by middleware later)
        if (mode === 'login') router.push('/dashboard'); // Example redirect for login
        if (mode === 'register') setSuccessMessage("Registration successful! You can now log in.");
      }

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
        setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-8 shadow-lg rounded-lg bg-gray-50 dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        {mode === 'login' ? 'Login' : 'Create Account'}
      </h2>

      {error && <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded-md">{error}</div>}
      {successMessage && <div className="p-3 bg-green-100 text-green-700 border border-green-400 rounded-md">{successMessage}</div>}

      {mode === 'register' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name (Optional)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
          minLength={mode === 'register' ? 8 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {mode === 'register' && (
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            I am a...
          </label>
          <select
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value as ClientUserRole)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={ClientUserRole.JOB_SEEKER}>Job Seeker</option>
            <option value={ClientUserRole.EMPLOYER}>Employer</option>
            {/* <option value={UserRole.ADMIN}>Admin</option> */} {/* Usually Admin role is not self-selectable */}
          </select>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (mode === 'login' ? 'Logging in...' : 'Creating account...') : (mode === 'login' ? 'Login' : 'Create Account')}
        </button>
      </div>
    </form>
  );
}