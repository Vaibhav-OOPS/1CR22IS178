import React from "react";

export default function ShortUrlList({ urls }) {
  if (!urls.length) return null;

  const containerStyle = {
    marginTop: 32,
  };

  const headerStyle = {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  };

  const paperStyle = {
    padding: 16,
    marginBottom: 8,
    boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
    borderRadius: 4,
    backgroundColor: "#fff",
  };

  const textStyle = {
    margin: "4px 0",
  };

  const linkStyle = {
    color: "#1976d2",
    textDecoration: "none",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>Shortened URLs</div>
      {urls.map((u, idx) => (
        <div style={paperStyle} key={idx}>
          <div style={textStyle}>Original: {u.longUrl}</div>
          <div style={textStyle}>
            Short URL:{" "}
            <a href={u.shortUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {u.shortUrl}
            </a>
          </div>
          <div style={textStyle}>Expires: {u.expiresAt}</div>
        </div>
      ))}
    </div>
  );
}
