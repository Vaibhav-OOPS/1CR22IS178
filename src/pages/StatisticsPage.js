import React, { useEffect, useState } from "react";

export default function StatisticsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem("logs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  const containerStyle = {
    maxWidth: "700px",
    margin: "20px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headerStyle = {
    fontSize: "24px",
    marginBottom: "20px",
    fontWeight: "bold",
  };

  const paperStyle = {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "4px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    fontSize: "13px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>App Logs</div>
      {logs.length === 0 && <div>No logs available.</div>}
      {logs.map((l, i) => (
        <div key={i} style={paperStyle}>
          <strong>{l.time}</strong> — <b>{l.type}</b>
          <br />
          <span>{JSON.stringify(l.payload)}</span>
        </div>
      ))}
    </div>
  );
}
