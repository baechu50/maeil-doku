import { useSessionContext } from "@supabase/auth-helpers-react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const { isLoading, session } = useSessionContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={session ? <MyPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
