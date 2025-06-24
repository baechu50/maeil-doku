import { Link } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";
import ReactGA from "react-ga4";

export default function MainPage() {
  const user = useUser();

  return (
    <div className="pt-36 flex flex-col items-center justify-center p-8 space-y-6">
      <img src="/logo.svg" alt="매일 도쿠" className="h-24 w-24" />
      <h1 className="text-3xl font-bold">매일 도쿠</h1>
      <p className="text-gray-600">매일 스도쿠 퍼즐로 두뇌를 깨워보세요.</p>

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
          초급 시작하기
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
          중급 시작하기
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
          고급 시작하기
        </Link>
      </div>
    </div>
  );
}
