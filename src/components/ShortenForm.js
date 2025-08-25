import React, { useState } from "react";
import { logEvent } from "../middleware/logger";

export default function ShortenForm({ onShorten, existingShortcodes }) {
  const [inputs, setInputs] = useState([{ url: "", validity: "", shortcode: "" }]);
  const [error, setError] = useState("");

  const handleInputChange = (idx, key, value) => {
    const next = [...inputs];
    next[idx][key] = value;
    setInputs(next);
  };

  const addField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", validity: "", shortcode: "" }]);
    }
  };

  function isValidUrl(url) {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  const validate = () => {
    for (const input of inputs) {
      if (!isValidUrl(input.url)) return "Enter a valid URL, including http/https";
      if (input.validity && (!/^\d+$/.test(input.validity) || +input.validity <= 0))
        return "Validity must be a positive integer";
      if (input.shortcode && (!/^[a-zA-Z0-9]+$/.test(input.shortcode) || input.shortcode.length > 10))
        return "Shortcode must be alphanumeric and ≤10 chars";
      if (input.shortcode && existingShortcodes.includes(input.shortcode))
        return `Shortcode "${input.shortcode}" is already in use, choose another`;
    }
    return "";
  };

  const submit = (e) => {
    e.preventDefault();
    const eMsg = validate();
    if (eMsg) {
      setError(eMsg);
      logEvent("ValidationError", { eMsg });
      return;
    }
    onShorten(inputs);
    setInputs([{ url: "", validity: "", shortcode: "" }]);
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: '600px', margin: 'auto', padding: '20px', backgroundColor: '#f2f2f2', borderRadius: '8px' }}>
      {inputs.map((input, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            required
            type="text"
            placeholder="Long URL"
            value={input.url}
            onChange={e => handleInputChange(idx, "url", e.target.value)}
            style={{ flex: 3, padding: '8px' }}
          />
          <input
            type="number"
            placeholder="Validity (min, default 30)"
            value={input.validity}
            onChange={e => handleInputChange(idx, "validity", e.target.value)}
            style={{ flex: 1, padding: '8px' }}
            min="1"
          />
          <input
            type="text"
            placeholder="Custom Shortcode (optional)"
            value={input.shortcode}
            onChange={e => handleInputChange(idx, "shortcode", e.target.value)}
            style={{ flex: 1, padding: '8px' }}
            maxLength={10}
          />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={addField} disabled={inputs.length >= 5} style={{ padding: '10px 20px' }}>
          Add URL
        </button>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Shorten
        </button>
      </div>
      {error && (
        <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
          {error}
        </div>
      )}
    </form>
  );
}
