import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const handleLogin = async (provider: "google" | "kakao") => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <div className="text-center mt-10 space-y-4">
      <h2 className="text-xl font-bold">로그인</h2>
      <button
        onClick={() => handleLogin("google")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        구글로 로그인
      </button>
    </div>
  );
}