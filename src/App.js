import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import StatisticsPage from "./pages/StatisticsPage";
import { logEvent } from "./middleware/logger";

function Redirector() {
  const { shortcode } = useParams();

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem("logs") || "[]");
    const urls = logs
      .filter(l => l.type === "ShortenSuccess")
      .map(l => l.payload);
    const urlMap = Object.fromEntries(urls.map(u => [u.shortcode, u.longUrl]));

    if (urlMap[shortcode]) {
      logEvent("Redirect", { shortcode, url: urlMap[shortcode] });
      window.location.href = urlMap[shortcode];  // Redirect by changing location
    }
  }, [shortcode]);

  // While redirecting or if shortcode not found, send user to home page
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/:shortcode" element={<Redirector />} />
      </Routes>
    </BrowserRouter>
  );
}
