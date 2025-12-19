import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const AddGalleryImage = () => {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]);

  const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  setPreview(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append("galleryImage", file);

  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/gallery/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error();

    const data = await res.json();
    setImage(data.imageUrl);
  } catch (err) {
    alert("Gallery image upload failed");
  } finally {
    setUploading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !image) {
      alert("Category & image required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/gallery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category,
            imageUrl: image,
          }),
        }
      );

      if (!res.ok) throw new Error();

      setCategory("");
      setImage("");
      setPreview("");
      fetchGallery();
      alert("Gallery image added");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save gallery image");
    }
  };

  const fetchGallery = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/gallery`);
  const data = await res.json();
  setGallery(data);
};

useEffect(() => {
  fetchGallery();
}, []);

const handleDelete = async (id) => {
  if (!window.confirm("Delete this image?")) return;

  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/gallery/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    fetchGallery();
  } catch (err) {
    alert("Delete failed");
    console.error(err);
  }
};



  const categories = ["Exterior","Hall", "Restaurant", "Rooms"];

  return (
    <AdminLayout>
      <div className="container mt-5 my-5">
        <h3 className="text-gold elegant-title mb-4">Add Gallery Image</h3>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Gallery Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleUpload}
                required
              />
            </div>
          </div>

          {preview && (
            <div className="text-center mt-4">
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: "200px", borderRadius: "10px" }}
              />
            </div>
          )}
            <div className="text-center mt-4">
                    <button
              type="submit"
              disabled={!image || uploading}
              className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill"
            >
              {uploading ? "Uploading..." : "Save Image"}
            </button>
            </div>
        </form>
        <hr className="my-5" />

<h4 className="text-gold elegant-title mb-4">
  Existing Gallery Images
</h4>

<div className="row g-4">
  {gallery.map((img) => (
    <div key={img._id} className="col-sm-6 col-md-4 col-lg-3">
      <div className="card shadow-sm border-0">
        <img
          src={img.url}
          alt={img.category}
          className="img-fluid rounded-top"
          style={{ height: "180px", objectFit: "cover" }}
        />

        <div className="card-body text-center">
          <small className="text-muted d-block mb-2">
            {img.category}
          </small>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(img._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </AdminLayout>
  );
};

export default AddGalleryImage;
