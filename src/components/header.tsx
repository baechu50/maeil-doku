import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";

export default function Header() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <div>🧩 매일 수도쿠</div>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-blue-500 underline">
          홈
        </Link>
        <Link to="/game" className="text-blue-500 underline">
          게임
        </Link>
        {user ? (
          <>
            <Link to="/mypage" className="text-blue-500 underline">
              마이페이지
            </Link>
            <button onClick={handleLogout} className="text-blue-500 underline">
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="text-blue-500 underline">
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}