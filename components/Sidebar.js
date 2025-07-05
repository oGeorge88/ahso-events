import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FiHome,
  FiSettings,
  FiLogOut,
  FiPlusCircle,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop and mobile
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Control visibility on mobile
  const router = useRouter();

  // Restore collapsed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored !== null) setIsCollapsed(JSON.parse(stored));
  }, []);

  // Store collapsed state
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleSidebarVisibility = () => setIsSidebarVisible(!isSidebarVisible);

  const handleSignOut = () => {
    router.push("/"); // Redirect to home page (sign out)
  };

  const navItems = [
    { href: "/home", label: "Upcoming Events", icon: <FiHome /> },
    { href: "/home?type=past", label: "Past Events", icon: <FiHome /> },
    { href: "/all-events", label: "All Events", icon: <FiHome /> },
    {
      href: "/create-event",
      label: "Create Event",
      icon: <FiPlusCircle />,
      className: "text-green-700 hover:text-green-900 font-semibold dark:text-green-400 dark:hover:text-green-600",
    },
    { href: "/settings", label: "Settings", icon: <FiSettings /> },
    {
      href: "/admin",
      label: "Admin Portal",
      icon: <FiUser />,
      className: "text-blue-700 hover:text-blue-900 font-semibold dark:text-blue-400 dark:hover:text-blue-600",
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg flex flex-col justify-between z-40
          ${isCollapsed ? "w-20" : "w-64"} transition-all duration-300 ease-in-out md:w-64
          ${isSidebarVisible ? "block" : "hidden"} md:block`}
      >
        {/* Header with Collapse Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#003366] dark:text-blue-400">
                AHSO Events
              </h2>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Toggle collapse"
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
          {navItems.map(({ href, label, icon, className }) => {
            const isActive = router.asPath.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-2 py-2 rounded-md transition
                  ${isActive
                    ? "bg-gray-100 dark:bg-gray-700 text-[#003366] dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                  ${className || ""}`}
                title={label}
              >
                <span>{icon}</span>
                {!isCollapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
            aria-label="Sign out"
          >
            <FiLogOut />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 md:ml-64 flex-1 p-4">
        {/* Button to toggle sidebar visibility on mobile */}
        <button
          onClick={toggleSidebarVisibility}
          className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-full shadow text-gray-700 dark:text-gray-300"
          aria-label="Toggle sidebar visibility"
        >
          {isSidebarVisible ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
        </button>

        {/* Main content goes here */}
      </main>

      {/* Mobile Overlay (for when sidebar is visible on mobile) */}
      {!isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={toggleSidebarVisibility}
        />
      )}
    </div>
  );
}
