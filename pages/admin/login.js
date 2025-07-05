import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Login function triggered with:', { email, password });

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#240046] to-[#5a189a] px-4 py-12">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center drop-shadow-lg">
        All Hallows Seminary, Onitsha
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="mx-auto mb-4"
          priority
        />
        <h2 className="text-2xl font-semibold text-[#240046] mb-4">Admin Login</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5a189a]"
          />
          <input
            type="password"
            placeholder="Admin Passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5a189a]"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#240046] hover:bg-[#3c096c]'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{' '}
          <button
            onClick={() => router.push('/admin/signup')}
            disabled={loading}
            className="text-[#5a189a] font-medium hover:underline"
          >
            Sign up here
          </button>
        </p>
        <button
          type="button"
          onClick={() => router.push('/home')}
          disabled={loading}
          className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
