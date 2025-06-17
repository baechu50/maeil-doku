import { Link } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";

export default function MainPage() {
  const user = useUser();

  return (
    <div className="pt-36 flex flex-col items-center justify-center p-8 space-y-6">
      <img src="/logo.svg" alt="매일 도쿠" className="h-24 w-24" />
      <h1 className="text-3xl font-bold">매일 도쿠</h1>
      <p className="text-gray-600">매일 수도쿠 퍼즐로 두뇌를 깨워보세요.</p>

      {user ? (
        <div className="text-sm text-gray-700">
          환영합니다, <span className="font-bold">{user.user_metadata.full_name}</span>님!{" "}
        </div>
      ) : (
        <div className="text-sm text-gray-700">
          기록을 저장하고 싶다면{" "}
          <Link to="/login" className="text-[#7E24FD] underline">
            로그인하세요
          </Link>
        </div>
      )}

      <Link
        to="/game"
        className="px-6 py-3 bg-[#7E24FD] text-white rounded hover:bg-[#7E24FD]/80 transition"
      >
        오늘의 퍼즐 시작하기
      </Link>
    </div>
  );
}
