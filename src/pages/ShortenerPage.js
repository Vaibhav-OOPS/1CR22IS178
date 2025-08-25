import React, { useState } from "react";
import ShortenForm from "../components/ShortenForm";
import ShortUrlList from "../components/ShortUrlList";
import { logEvent } from "../middleware/logger";

function genShortcode(existing, custom) {
  if (custom && !existing.includes(custom)) return custom;
  let c;
  do {
    c = Math.random().toString(36).substring(2, 8);
  } while (existing.includes(c));
  return c;
}

export default function ShortenerPage() {
  const [urls, setUrls] = useState([]);
  const [snack, setSnack] = useState("");

  function handleShorten(inputs) {
    const now = Date.now();
    let news = [];
    let allCodes = urls.map(u => u.shortcode);
    for (const x of inputs) {
      const mins = +x.validity > 0 ? +x.validity : 30;
      const shortcode = genShortcode(allCodes, x.shortcode);
      allCodes.push(shortcode);
      news.push({
        longUrl: x.url,
        shortcode,
        shortUrl: window.location.origin + "/" + shortcode,
        expiresAt: new Date(now + mins * 60000).toLocaleString(),
        validUntil: now + mins * 60000
      });
      logEvent("ShortenSuccess", { shortcode, url: x.url, mins });
    }
    setUrls([...urls, ...news]);
    setSnack("URLs shortened successfully");
  }

  return (
    <div style={{ maxWidth: "700px", margin: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <header style={{ backgroundColor: "#1976d2", padding: "15px", color: "white", textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
        URL Shortener
      </header>

      <main style={{ padding: "20px" }}>
        <ShortenForm onShorten={handleShorten} existingShortcodes={urls.map(u => u.shortcode)} />
        <ShortUrlList urls={urls} />
      </main>

      {/* Snackbar replacement */}
      {snack && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#323232",
            color: "white",
            padding: "12px 24px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        >
          {snack}
          <button
            onClick={() => setSnack("")}
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "none",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
