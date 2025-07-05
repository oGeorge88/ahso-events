import { useAppContext } from "../contexts/AppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaBell, FaMoon, FaLanguage } from "react-icons/fa";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { darkMode, setDarkMode, language, setLanguage } = useAppContext();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    toast.success(language === "en" ? "Dark mode enabled" : "Uzo Ojii egosipụtara");
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    toast.success(language === "en" ? "Notifications toggled" : "Ịkpalite Ozi gbanwere");
  };

  const handleSwitchLanguage = () => {
    const newLanguage = language === "en" ? "ig" : "en";
    setLanguage(newLanguage);
    toast.success(newLanguage === "en" ? "Switched to English" : "Gbanwee gaa Igbo");
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(language === "en" ? "Settings saved" : "Ntọala echekwara");
    }, 1000);
  };

  const handleSignOut = () => {
    router.push("/");
  };

  if (!isMounted) return null;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-10 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="w-full max-w-md space-y-6">

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="self-start mb-4 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          ← {language === "en" ? "Back" : "Laghachi"}
        </button>

        <h1 className="text-3xl md:text-4xl font-bold text-center">
          {language === "en" ? "Settings" : "Ntọala"}
        </h1>

        {/* Notifications Toggle */}
        <section className="flex items-center justify-between w-full py-4 border-b">
          <div className="flex items-center">
            <FaBell className="text-2xl mr-4 text-yellow-500" aria-hidden="true" />
            <span className="text-lg">{language === "en" ? "Notifications" : "Ịkpalite Ozi"}</span>
          </div>
          <label className="inline-flex items-center cursor-pointer" htmlFor="notifications-toggle">
            <input
              id="notifications-toggle"
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              aria-label={language === "en" ? "Toggle Notifications" : "Gbanwee Ozi"}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-300 peer-checked:bg-red-500 rounded-full relative
                         after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5
                         after:rounded-full after:transition-all peer-checked:translate-x-5"
            ></div>
          </label>
        </section>

        {/* Dark Mode Toggle */}
        <section className="flex items-center justify-between w-full py-4 border-b">
          <div className="flex items-center">
            <FaMoon className="text-2xl mr-4 text-gray-700 dark:text-gray-300" aria-hidden="true" />
            <span className="text-lg">{language === "en" ? "Dark Mode" : "Uzo Ojii"}</span>
          </div>
          <label className="inline-flex items-center cursor-pointer" htmlFor="darkmode-toggle">
            <input
              id="darkmode-toggle"
              type="checkbox"
              checked={darkMode}
              onChange={handleToggleDarkMode}
              aria-label={language === "en" ? "Toggle Dark Mode" : "Gbanwee Uzo Ojii"}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-300 peer-checked:bg-black rounded-full relative
                         after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5
                         after:rounded-full after:transition-all peer-checked:translate-x-5"
            ></div>
          </label>
        </section>

        {/* Language Switch Button */}
        <section className="flex items-center justify-between w-full py-4 border-b">
          <div className="flex items-center">
            <FaLanguage className="text-2xl mr-4 text-blue-500" aria-hidden="true" />
            <span className="text-lg">{language === "en" ? "Language" : "Asụsụ"}</span>
          </div>
          <button
            onClick={handleSwitchLanguage}
            className="px-3 py-1 rounded bg-gray-200 text-black text-sm hover:bg-gray-300"
          >
            {language === "en" ? "Switch to Igbo" : "Gbanwee gaa English"}
          </button>
        </section>

        {/* Save Settings Button */}
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded-full font-semibold text-lg disabled:opacity-70"
        >
          {isSaving
            ? language === "en"
              ? "Saving..."
              : "Na-echekwa..."
            : language === "en"
            ? "Save Settings"
            : "Chekwaa Ntọala"}
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full bg-[#2A007E] hover:bg-[#1F0061] transition-colors text-white py-3 rounded-full font-semibold text-lg"
        >
          {language === "en" ? "Sign Out" : "Pụọ"}
        </button>
      </div>
    </div>
  );
}
