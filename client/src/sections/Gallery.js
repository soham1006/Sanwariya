import { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(setImages);
  }, []);

  const categories = [
    { key: "rooms", label: "Rooms" },
    { key: "restaurant", label: "Restaurant" },
    { key: "hall", label: "Banquet / Hall" },
  ];

  return (
    <section
      id="gallery"
      className="py-5"
      style={{ backgroundColor: "#fffaf2" }}
    >
      <div className="container">

        {/* TITLE */}
        <h2 className="text-center mb-5 fw-semibold" style={{ color: "#c9a227" }}>
          Our Gallery
        </h2>

        {/* NO IMAGES */}
        {images.length === 0 && (
          <p className="text-center text-muted">
            Gallery images will be available soon.
          </p>
        )}

        {categories.map(cat => {
          const catImages = images.filter(
            img => img.category === cat.key
          );

          if (catImages.length === 0) return null;

          return (
            <div key={cat.key} className="mb-5">

              {/* CATEGORY TITLE */}
              <h4
                className="mb-4 fw-semibold"
                style={{ color: "#c9a227" }}
              >
                {cat.label}
              </h4>

              {/* IMAGES */}
              <div className="row g-4 justify-content-center">
                {catImages.map(img => (
                  <div
                    key={img._id}
                    className="col-sm-6 col-md-4 col-lg-3"
                  >
                    <div
                      className={`card border-0 rounded overflow-hidden h-100 ${
                        hovered === img._id ? "shadow-lg" : "shadow"
                      }`}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        transform:
                          hovered === img._id
                            ? "translateY(-6px)"
                            : "none",
                      }}
                      onMouseEnter={() => setHovered(img._id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <img
                        src={img.url}
                        alt={cat.label}
                        className="card-img-top"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          );
        })}

      </div>
    </section>
  );
};

export default Gallery;
