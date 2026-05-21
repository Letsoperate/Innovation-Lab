import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SubmitPage from "./pages/SubmitPage";
import BlogPage from "./pages/BlogPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import HallOfFamePage from "./pages/HallOfFamePage";
import SponsorLoginPage from "./pages/SponsorLoginPage";
import SponsorDashboard from "./pages/SponsorDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
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
            <Route path="/sponsor/login" element={<SponsorLoginPage />} />
            <Route path="/sponsor/dashboard" element={<SponsorDashboard />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
