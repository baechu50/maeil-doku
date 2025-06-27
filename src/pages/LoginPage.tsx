import { supabase } from "@/lib/supabaseClient";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();

  const handleLogin = async (provider: "google" | "kakao") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center mt-24 gap-4 p-12">
      <h2 className="text-2xl font-bold text-gray-800">{t("app.title")}</h2>
      <p className="text-gray-600 text-sm">{t("login.continue")}</p>
      <button
        onClick={() => handleLogin("google")}
        className="px-4 py-2 bg-[#7E24FD] text-white rounded hover:bg-purple-600 transition"
      >
        {t("login.google")}
      </button>
    </div>
  );
}
