import { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/gallery")
      .then((res) => res.json())
      .then(setImages)
      .catch(() => {});
  }, []);

  const categories = [
    {
      key: "Rooms",
      label: "Rooms",
      description:
        "Comfortable AC & Non-AC rooms with modern amenities, lift access, and peaceful stay for families & travelers.",
      points: [
        "AC & Non-AC options",
        "Lift service available",
        "Family friendly stay",
      ],
    },
    {
      key: "Restaurant",
      label: "Restaurant",
      description:
        "Pure vegetarian restaurant with hygienic dining. Table booking available for families and groups.",
      points: [
        "Pure vegetarian food",
        "Clean & hygienic dining",
        "Table booking available",
      ],
    },
    {
      key: "Hall",
      label: "Banquet / Hall",
      description:
        "Spacious hall for birthdays, anniversaries, kitty parties, and small events with decoration support.",
      points: [
        "Birthday & anniversary events",
        "Kitty parties & functions",
        "Decoration support",
      ],
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: "#fffaf2" }}>
      <div className="container">

        {/* TITLE */}
        <h2 className="text-center mb-5 fw-semibold text-golden elegant-title">
          Our Gallery
        </h2>

        {/* CATEGORIES */}
        {categories.map((cat, index) => {
          const catImages = images.filter(
            (img) => img.category === cat.key
          );

          if (catImages.length === 0) return null;

          const reverse = index % 2 !== 0;

          return (
            <div key={cat.key} className="mb-5 pb-4 border-bottom">

              <div
                className={`row align-items-center ${
                  reverse ? "flex-row-reverse" : ""
                }`}
              >

                {/* TEXT */}
                <div className="col-12 col-lg-4 mb-4 mb-lg-0">
                  <h4 className="fw-semibold text-golden elegant-title mb-3">
                    {cat.label}
                  </h4>

                  <p className="text-muted mb-3">
                    {cat.description}
                  </p>

                  <ul className="list-unstyled text-muted small">
                    {cat.points.map((p, i) => (
                      <li key={i} className="mb-2">
                        ✓ {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* IMAGES */}
                <div className="col-12 col-lg-8">
                  <div className="row g-4">
                    {catImages.slice(0, 4).map((img) => (
                      <div key={img._id} className="col-12 col-sm-6">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                          <img
                            src={img.url}
                            alt={cat.label}
                            className="img-fluid"
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

              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default Gallery;
