import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeButton() {
  // State to track whether dark mode is enabled
  const [isDark, setIsDark] = useState(false);

  // On mount, read saved theme preference from localStorage and apply it
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      // Add "dark" class to root element to enable dark mode styles
      document.documentElement.classList.add("dark");
      setIsDark(true); // Update state to reflect dark mode is active
    }
  }, []);

  // Function to toggle dark mode on/off
  const toggleDarkMode = () => {
    const root = document.documentElement;

    // Toggle "dark" class on the root element; returns true if class added
    const newIsDark = root.classList.toggle("dark");

    // Persist the new theme preference in localStorage
    localStorage.setItem("theme", newIsDark ? "dark" : "light");

    // Update state so UI can react accordingly (e.g., change icon)
    setIsDark(newIsDark);
  };

  return (
    <button onClick={toggleDarkMode} className="hover-animate cursor-pointer">
      {/* Show Sun icon if dark mode is active, Moon icon if light mode */}
      {isDark ? (
        <Sun className="ml-4 dark:text-white" />
      ) : (
        <Moon className="ml-4" />
      )}
    </button>
  );
}
