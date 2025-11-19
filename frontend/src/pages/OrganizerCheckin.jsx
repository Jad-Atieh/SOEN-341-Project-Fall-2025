import { useState } from "react";
import jsQR from "jsqr";
import api from "../api"; 
import "../styles/PageStyle.css";
import { Link } from "react-router-dom";

function OrganizerCheckin() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const extractQRCodeFromImage = (imageFile) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode) resolve(qrCode.data);
        else reject(new Error("invalid QR code"));
      };

      img.onerror = () => reject(new Error("invalid QR code"));
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a QR code image first.");
      return;
    }

    setLoading(true);
    setMessage("Processing QR code...");

    try {
      const qrCodeData = await extractQRCodeFromImage(file);

      const verificationMatch = qrCodeData.match(/ticket_\d+_user_\d+_event_\d+/);
      const qrCodeString = verificationMatch ? verificationMatch[0] : qrCodeData;

      const res = await api.post("/api/tickets/checkin/", { qr_code: qrCodeString });
      const data = res.data;

      setMessage(data.message);
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.error || err.response.data.message);
      } else {
        setMessage(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(`Selected: ${selectedFile.name}`);
    } else {
      setFile(null);
      setMessage("No file selected");
    }
  };

  return (
    <div className="organizer-dashboard">
      <div className="organizer-header">
        <h1>QR Check-in</h1>
        <p>Upload a student's QR code image to check them in</p>
      </div>

      {/* Top Buttons for navigation */}
      <div className="organizer-buttons">
        <Link to="/create-event"><button>Create Event</button></Link>
        <Link to="/organizer/analytics"><button>Analytics</button></Link>
        <Link to="/organizer/checkin"><button className="active">QR Check-in</button></Link>
      </div>

      {/* Check-in Card */}
      <div className="organizer-checkin-card">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Processing QR Code..." : "Check In"}
        </button>

        {message && (
          <p className={`organizer-checkin-message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default OrganizerCheckin;
