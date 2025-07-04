import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

export default function Header() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <span className="text-lg font-bold text-gray-800 hidden sm:inline">{t("app.title")}</span>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" className="text-gray-600 hover:bg-purple-50 font-semibold">
                {t("header.home")}
              </Button>
            </Link>
            <Link to="/game">
              <Button variant="ghost" className="text-gray-600 hover:bg-purple-50 font-semibold">
                {t("header.game")}
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/mypage">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:bg-purple-50 font-semibold"
                  >
                    {t("header.mypage")}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-gray-600 hover:bg-purple-50 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  {t("header.logout")}
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:bg-purple-50 font-semibold">
                  {t("header.login")}
                </Button>
              </Link>
            )}
            {/* 언어 선택기 */}
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  );
}
