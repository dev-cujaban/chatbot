import { Trans, useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import Chat from "./components/chat/Chat";

function App() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen dark:bg-black">
        <section className="flex flex-col gap-10 w-md mx-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-center text-5xl font-black dark:text-white">
              {t("welcome_title")}
            </h1>
            <h2 className="text-center text-3xl font-bold text-gray-500">
              {t("welcome_subtitle")}
            </h2>
          </div>
          <p className="text-justify text-gray-400">
            <Trans
              i18nKey="project_description"
              components={{ 1: <b />, 3: <b />, 5: <b />, 7: <b />, 9: <b /> }}
            />
            <br />
            <br />{" "}
            <Trans i18nKey="project_advanced" components={{ 1: <b /> }} />
          </p>
          <Chat />
        </section>
      </div>
    </>
  );
}

export default App;
