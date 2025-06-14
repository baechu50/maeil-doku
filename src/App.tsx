import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";
import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage"; 
import { useUser } from "@supabase/auth-helpers-react";

export default function App() {
  const user = useUser();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={user ? <MyPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}