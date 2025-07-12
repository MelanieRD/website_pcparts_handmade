import React, { useRef, useState } from "react";
import "./FormStyles.css";

interface ImageGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
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

const ImageGalleryManager: React.FC<ImageGalleryManagerProps> = ({ images, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    try {
      // Subir a Cloudinary
      const url = await uploadToCloudinary(file);
      onChange([...images, url]);
    } catch (err) {
      alert("Error al subir la imagen a Cloudinary");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="image-gallery-manager">
      <div className="image-gallery-list">
        {images.map((img, idx) => (
          <div className="image-gallery-item" key={idx}>
            <img src={img} alt={`Imagen ${idx + 1}`} />
            <button type="button" className="remove-image-btn" onClick={() => handleRemoveImage(idx)}>
              ✕
            </button>
          </div>
        ))}
        <div className="image-gallery-add">
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleAddImage} disabled={isUploading} />
          <button type="button" className={`add-image-btn ${isUploading ? "uploading" : ""}`} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? (
              <>
                <span className="spinner">⏳</span>
                Subiendo...
              </>
            ) : (
              "➕ Agregar Imagen"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryManager;
