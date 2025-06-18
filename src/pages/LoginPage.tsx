import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
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
      <h2 className="text-2xl font-bold text-gray-800">매일 도쿠</h2>
      <p className="text-gray-600 text-sm">계속하려면 로그인하세요</p>
      <button
        onClick={() => handleLogin("google")}
        className="px-24 py-2 bg-[#7E24FD] text-white rounded hover:bg-purple-600 transition"
      >
        구글로 로그인
      </button>
    </div>
  );
}
