import { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [verticalMap, setVerticalMap] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/gallery`)
      .then((res) => res.json())
      .then(setImages)
      .catch(() => {});
  }, []);

  const detectOrientation = (url, id) => {
    if (verticalMap[id] !== undefined) return;

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setVerticalMap((prev) => ({
        ...prev,
        [id]: img.height > img.width,
      }));
    };
  };

  const categories = [
    {
      key: "Exterior",
      label: "Hotel Exterior",
      description:
        "Prime location with easy access, parking, and a well-maintained building.",
      points: [
        "Centrally located",
        "Easy parking access",
        "Lift & multiple floors",
      ],
    },
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
        <h2 className="text-center mb-5 fw-semibold text-golden elegant-title">
          Our Gallery
        </h2>

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

                  <p className="text-muted mb-4" style={{ lineHeight: "1.8" }}>
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
                    {catImages.slice(0, 4).map((img) => {
                      detectOrientation(img.url, img._id);
                      const isVertical = verticalMap[img._id];

                      return (
                        <div key={img._id} className="col-12 col-sm-6">
                          <div
                            className="rounded-4 shadow-sm d-flex justify-content-center align-items-center"
                            style={{
                              height: isVertical ? "420px" : "220px",
                              padding: isVertical ? "12px" : "0",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={img.url}
                              alt={cat.label}
                              style={{
                                height: "100%",
                                width: isVertical ? "auto" : "100%",
                                objectFit: isVertical
                                  ? "contain"
                                  : "cover",
                                borderRadius: "14px",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
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
