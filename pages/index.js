import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function SplashScreen() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggingIn) {
      const timer = setTimeout(() => {
        router.push('/home');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoggingIn, router]);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    router.push('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-[#0d0d0d] text-black dark:text-white transition-colors duration-300">
      <Image src="/logo.png" alt="AHS Logo" width={180} height={180} />
      
      <h1 className="text-3xl font-bold mt-6">AHS Event</h1>
      
      <button
        onClick={handleGoogleLogin}
        className="mt-10 bg-[#240046] text-white py-2 px-6 rounded-lg flex items-center hover:bg-[#3c096c] transition"
      >
        <Image
          src="/google-logo.svg"
          width={20}
          height={20}
          alt="Google logo"
          className="mr-2"
        />
        Log in with GOOGLE
      </button>
    </div>
  );
}
