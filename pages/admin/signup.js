import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const DEFAULT_PASSCODE = 'adminispowerful';

export default function AdminSignup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (passcode !== DEFAULT_PASSCODE) {
      setError('Invalid admin passcode');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Signup failed. Please try again.');
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

      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <Image src="/logo.png" width={60} height={60} alt="Logo" className="mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-[#240046] mb-4">Admin Signup</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5a189a]"
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5a189a]"
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Admin Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#5a189a]"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className={`w-full py-2 text-white rounded ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#240046] hover:bg-[#3c096c]'
          }`}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        <p className="text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/admin/login')}
            className="text-[#5a189a] font-medium hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
        <button
          type="button"
          onClick={() => router.push('/home')}
          className="mt-4 w-full py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          disabled={loading}
        >
          Back to Home
        </button>
      </form>
    </div>
  );
}
