import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#00083B] dark:bg-gray-900 text-white dark:text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Brand / Copyright */}
        <div className="text-lg font-semibold mb-4 md:mb-0">
          © {new Date().getFullYear()} All Hallows Seminary Onitsha, Nigeria. All rights reserved.
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-sm">
          <Link href="https://allhallowsseminary.com/" passHref>
            <span className="cursor-pointer hover:underline">About Us</span>
          </Link>
          <Link href="https://allhallowsseminary.com/contact/" passHref>
            <span className="cursor-pointer hover:underline">Contact Us</span>
          </Link>
          <Link href="https://allhallowsseminary.com/blog/" passHref>
            <span className="cursor-pointer hover:underline">Blog</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
