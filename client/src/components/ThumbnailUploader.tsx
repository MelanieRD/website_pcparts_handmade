import React, { useRef, useState } from "react";
import "./FormStyles.css";

interface ThumbnailUploaderProps {
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Error al subir imagen a Cloudinary");
  return data.secure_url;
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({ value, onChange, required = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    try {
      // Subir a Cloudinary
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err) {
      alert("Error al subir la imagen a Cloudinary");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleRemoveImage = () => {
    onChange("");
  };

  return (
    <div className="thumbnail-uploader">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Imagen Principal *</label>
          <div className="thumbnail-input-container">
            <input
              className="form-input"
              type="url"
              value={value}
              onChange={handleUrlChange}
              required={required}
              placeholder="https://example.com/thumbnail.jpg o sube una imagen"
              disabled={isUploading}
            />
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileSelect} disabled={isUploading} />
            <button type="button" className={`upload-btn ${isUploading ? "uploading" : ""}`} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? (
                <>
                  <span className="spinner">⏳</span>
                  Subiendo...
                </>
              ) : (
                "📁 Subir Imagen"
              )}
            </button>
          </div>
        </div>
      </div>

      {value && (
        <div className="form-image-preview">
          <div className="form-image-item thumbnail-preview">
            <img src={value} alt="Thumbnail" />
            <button type="button" className="remove-thumbnail-btn" onClick={handleRemoveImage} title="Eliminar imagen">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailUploader;
