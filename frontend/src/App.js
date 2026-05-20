import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SubmitPage from "./pages/SubmitPage";
import BlogPage from "./pages/BlogPage";
import LeaderboardPage from "./pages/LeaderboardPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
