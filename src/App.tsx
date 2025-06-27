import { useSessionContext } from "@supabase/auth-helpers-react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, Suspense } from "react";
import ReactGA from "react-ga4";
import Header from "./components/header";
import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "@/components/ui/sonner";

function RouteChangeTracker() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  return null;
}

export default function App() {
  const { isLoading, session } = useSessionContext();

  useEffect(() => {
    ReactGA.initialize([
      {
        trackingId: "G-YZ0Q7SEGEY",
      },
    ]);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading translations...</div>}>
      <Router>
        <RouteChangeTracker />
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={session ? <MyPage /> : <Navigate to="/login" />} />
        </Routes>
        <Toaster />
      </Router>
    </Suspense>
  );
}
