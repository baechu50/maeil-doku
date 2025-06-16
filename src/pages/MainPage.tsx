import { Link } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";

export default function MainPage() {
  const user = useUser();

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <h1 className="text-3xl font-bold">🧩 매일 수도쿠</h1>
      <p className="text-gray-600">매일 새로운 퍼즐로 두뇌를 깨워보세요.</p>

      <Link
        to="/game"
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        오늘의 퍼즐 시작하기
      </Link>

      {user ? (
        <div className="text-sm text-gray-700">환영합니다, {user.user_metadata.full_name}님! </div>
      ) : (
        <div className="text-sm text-gray-700">
          기록을 저장하고 싶다면{" "}
          <Link to="/login" className="text-blue-500 underline">
            로그인하세요
          </Link>
        </div>
      )}
    </div>
  );
}
