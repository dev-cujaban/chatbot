import { useTranslation } from "react-i18next";
import ThemeButton from "./ThemeButton";

export default function Navbar() {
  const { i18n } = useTranslation();

  // Function to change the language when a new option is selected
  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex gap-y-5 md:gap-y-0 md:flex-row items-center justify-between px-2 md:px-[50px] py-3.5 shadow-md dark:bg-black bg-white">
      <a href="https://www.wizybot.com/" className="hover-animate">
        {/* Light mode logo */}
        <img
          src="./logo_black.png"
          className="w-[150px] block dark:hidden"
          alt="Logo Light"
        />
        {/* Dark mode logo */}
        <img
          src="./logo_white.png"
          className="w-[150px] hidden dark:block"
          alt="Logo Dark"
        />
      </a>

      {/* Container for language selector and theme toggle button */}
      <div className="flex items-center justify-center gap-5">
        <select
          onChange={changeLanguage}
          defaultValue={i18n.language}
          className="border border-gray-300 rounded px-3 py-1 dark:text-white dark:bg-black cursor-pointer"
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>

        {/* Theme toggle button component */}
        <ThemeButton />
      </div>
    </div>
  );
}
