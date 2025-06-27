import { Link } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import ReactGA from "react-ga4";
import { useTranslation } from "react-i18next";

export default function MainPage() {
  const user = useUser();
  const { t } = useTranslation();

  return (
    <div className="pt-36 flex flex-col items-center justify-center p-8 space-y-6">
      <img src="/logo.svg" alt={t("app.title")} className="h-24 w-24" />
      <h1 className="text-3xl font-bold">{t("app.title")}</h1>
      <p className="text-gray-600">{t("main.slogan")}</p>

      {user ? (
        <div className="text-sm text-gray-700">
          {t("main.welcome", { name: user.user_metadata.full_name })}{" "}
        </div>
      ) : (
        <div className="text-sm text-gray-700">
          {t("main.savePrompt")}{" "}
          <Link to="/login" className="text-[#7E24FD] underline">
            {t("main.login")}
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/game?difficulty=easy"
          onClick={() => {
            ReactGA.event("select_difficulty", {
              category: "sudoku",
              label: "easy",
            });
          }}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition text-center"
        >
          {t("main.startEasy")}
        </Link>
        <Link
          to="/game?difficulty=medium"
          onClick={() => {
            ReactGA.event("select_difficulty", {
              category: "sudoku",
              label: "medium",
            });
          }}
          className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-center"
        >
          {t("main.startMedium")}
        </Link>
        <Link
          to="/game?difficulty=hard"
          onClick={() => {
            ReactGA.event("select_difficulty", {
              category: "sudoku",
              label: "hard",
            });
          }}
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition text-center"
        >
          {t("main.startHard")}
        </Link>
      </div>
    </div>
  );
}
