import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function OrganizerCheckin() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const id = "qr-reader";
    const onSuccess = (decodedText) => {
      setCode(decodedText);
      setStatus("Checking...");
      fetch(`${API_BASE}/api/checkin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: decodedText })
      }).then(r => setStatus(r.ok ? "Success" : "Error"))
        .catch(() => setStatus("Success"));
    };
    const onFail = () => { };

    const scanner = new Html5QrcodeScanner(id, { fps: 8, qrbox: 250 }, false);
    scanner.render(onSuccess, onFail);
    scannerRef.current = scanner;

    return () => { try { scanner.clear(); } catch { /* empty */ } };
  }, []);

  const scanImageFile = async (file) => {
    if (!file) return;
    setStatus("Checking...");
    const tmpId = "qr-image-reader";
    const html5 = new Html5Qrcode(tmpId);
    try {
      const res = await html5.scanFile(file, true);
      setCode(res);
      const r = await fetch(`${API_BASE}/api/checkin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: res })
      });
      setStatus(r.ok ? "Success" : "Error");
    } catch {
      setStatus("Error");
    } finally {
      try { await html5.stop(); } catch { /* empty */ }
      try { await html5.clear(); } catch { /* empty */ }
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px", display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>QR Check-in</h1>

      <div id="qr-reader" style={{ width: 360, maxWidth: "100%" }} />

      <div style={{ display: "grid", gap: 8 }}>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Manual code" />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => scanImageFile(fileInputRef.current?.files?.[0])}>Upload QR</button>
          <input ref={fileInputRef} type="file" accept="image/*" />
          <button onClick={async () => {
            setStatus("Checking...");
            try {
              const r = await fetch(`${API_BASE}/api/checkin/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ code })
              });
              setStatus(r.ok ? "Success" : "Error");
            } catch { setStatus("Error"); }
          }}>Check-in</button>
          <div>{status}</div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerCheckin;