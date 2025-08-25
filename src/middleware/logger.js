export function logEvent(type, payload) {
  // Deep clone payload to avoid mutating the caller's object
  const safePayload = JSON.parse(JSON.stringify(payload));

  const sensitiveKeys = ['access_token', 'refresh_token', 'password', 'token', 'authorization'];
  function redact(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key in obj) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        redact(obj[key]);
      }
    }
  }

  redact(safePayload);

  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({ time: new Date().toISOString(), type, payload: safePayload });
  localStorage.setItem('logs', JSON.stringify(logs));
}
