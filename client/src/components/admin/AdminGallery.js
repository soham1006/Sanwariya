import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

const AdminGallery = () => {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [gallery, setGallery] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchGallery = async () => {
    const res = await axios.get("http://localhost:5000/api/gallery");
    setGallery(res.data);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image || !category) {
      alert("Please select category and image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("category", category);

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/gallery/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // reset states
      setImage(null);
      setCategory("");
      setPreview(null);

      fetchGallery();
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    await axios.delete(`http://localhost:5000/api/gallery/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchGallery();
  };

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <AdminLayout>
      <div className="container-fluid px-4 py-4">

        {/* PAGE TITLE */}
        <h2 className="fw-bold mb-4" style={{ color: "#d4a017" }}>
          Add Gallery Image
        </h2>

        {/* UPLOAD CARD */}
        <div className="card shadow-sm border-0 rounded-4 mb-5">
          <div className="card-body p-4">

            <form onSubmit={handleUpload}>
              <div className="row g-4 align-items-end">

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Category
                  </label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="rooms">Rooms</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hall">Banquet / Hall</option>
                  </select>
                </div>

                <div className="col-md-5">
                  <label className="form-label fw-semibold">
                    Gallery Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }}
                  />

                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="img-fluid rounded mt-3 border"
                      style={{ maxHeight: "160px" }}
                    />
                  )}
                </div>

                <div className="col-md-3 text-end">
                  <button
                    type="submit"
                    className="btn btn-warning px-4 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>

              </div>
            </form>

          </div>
        </div>

        {/* UPLOADED IMAGES */}
        <h4 className="fw-semibold mb-3">Uploaded Images</h4>

        <div className="row g-4">
          {gallery.length === 0 && (
            <p className="text-muted">No images uploaded yet.</p>
          )}

          {gallery.map((img) => (
            <div key={img._id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card shadow-sm border-0 h-100 rounded-4">
                <img
                  src={img.url}
                  alt="gallery"
                  className="card-img-top rounded-top-4"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex justify-content-between align-items-center">
                  <span className="badge bg-dark text-capitalize">
                    {img.category}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteImage(img._id)}
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

export default AdminGallery;
