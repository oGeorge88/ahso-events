import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#00083B] dark:bg-gray-900 shadow-md px-4 py-3 md:px-8 flex justify-between items-center">
      {/* Dashboard Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-white dark:text-gray-200">
        AHSO_Event ACTIVITIES
      </h1>

      {/* Right side content */}
      <div className="flex items-center gap-6 ml-auto">
        {/* About Us Link */}
        <Link
          href="https://allhallowsseminary.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:underline text-lg font-medium transition"
        >
          About Us
        </Link>

        {/* Admin Portal Link */}
        <Link
          href="/admin"
          className="text-white dark:text-gray-300 hover:text-blue-300 dark:hover:text-blue-400 hover:underline text-lg font-medium transition"
        >
          Admin Portal
        </Link>

        {/* Calendar Link */}
        <Link
          href="/calendar"
          className="text-white dark:text-gray-300 hover:text-yellow-300 dark:hover:text-yellow-400 hover:underline text-lg font-medium transition"
        >
          Calendar
        </Link>

        {/* Welcome message */}
        <p className="text-white dark:text-gray-300 text-sm hidden sm:block font-medium">
          Welcome back!
        </p>

        {/* Profile Image */}
        <Image
          src="/logo.png"
          width={40}
          height={40}
          alt="Profile"
          className="rounded-full border border-white dark:border-gray-300 shadow-sm"
        />
      </div>
    </header>
  );
}
