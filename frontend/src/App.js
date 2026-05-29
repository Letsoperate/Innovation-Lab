import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SubmitPage from "./pages/SubmitPage";
import BlogPage from "./pages/BlogPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import ProjectPage from "./pages/ProjectPage";
import HallOfFamePage from "./pages/HallOfFamePage";
import SearchPage from "./pages/SearchPage";
import SponsorLoginPage from "./pages/SponsorLoginPage";
import SponsorDashboard from "./pages/SponsorDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";

function NotFoundPage() {
  useEffect(() => { document.title = "Page Not Found — Innovation Lab"; }, []);
  return (
    <div className="w-full px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-purple-800 mb-4">404</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="px-6 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors">
        Go Home
      </a>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
          <Navbar />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/hall-of-fame" element={<HallOfFamePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/track/:slug" element={<CategoryPage />} />
              <Route path="/audience/:slug" element={<CategoryPage />} />
              <Route path="/p/:slug" element={<ProjectPage />} />
              <Route path="/sponsor/login" element={<SponsorLoginPage />} />
              <Route path="/sponsor/dashboard" element={<SponsorDashboard />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
          <Footer />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
