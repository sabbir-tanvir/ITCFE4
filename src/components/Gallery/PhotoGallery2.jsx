import { useEffect, useState } from "react";
import { fetchSiteSettings } from "../../config/siteSettingsApi";
import { Api_Base_Url, Site_Id } from "../../config/api";
import { ShimmerThumbnail } from "react-shimmer-effects";

const PhotoGallery2 = () => {
  const [showAll, setShowAll] = useState(false);
  const [buttonColor, setButtonColor] = useState("#FC5D43");
  const [primaryColor, setPrimaryColor] = useState("#f50000"); // fallback
  const [secondaryColor, setSecondaryColor] = useState("#f0f0f0"); // fallback
  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch site settings directly (no caching)
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data) {
          if (data.button_color) setButtonColor(data.button_color);
          if (data.primary_color) setPrimaryColor(data.primary_color);
          if (data.secondary_color) setSecondaryColor(data.secondary_color);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch site settings:", err);
      });
  }, []);

  // Fetch images from /activities endpoint
  useEffect(() => {
    setIsLoading(true);
    fetch(`${Api_Base_Url}/activities`, {
      headers: {
        "Site-Id": Site_Id,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const imgs = Array.isArray(data.results) ? data.results : data;
        setImages(imgs);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch images:", err);
        setImages([]);
        setIsLoading(false);
      });
  }, []);

  const handleImageClick = (idx) => {
    setSelectedIndex(idx);
  };

  const handleClosePopup = () => {
    setSelectedIndex(null);
  };

  const handleNextImage = () => {
    if (images.length === 0 || selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (images.length === 0 || selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const ImagePopup = ({ index, onClose }) => {
    if (index === null || !images[index]) return null;
    const img = images[index];
    const imgUrl = img.image || img.url || img.photo || img.img || "";

    return (
      <div
        className="fixed pt-[30vh] inset-0 z-50 bg-black bg-opacity-75"
        onClick={onClose}
      >
        <button
          className="absolute left-[calc(50%-500px)] top-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md text-gray-600 hover:text-gray-800 transition-transform hover:scale-110 z-50"
          onClick={(e) => {
            e.stopPropagation();
            handlePrevImage();
          }}
        >
          <svg width="64px" height="64px" viewBox="0 0 24 24" fill="#000000" transform="rotate(0)matrix(-1, 0, 0, 1, 0, 0)">
            <rect width="24" height="24" fill="#141124" opacity="0" />
            <path d="M10.22,9.28a.75.75,0,0,1,0-1.06l2.72-2.72H.75A.75.75,0,0,1,.75,4H12.938L10.22,1.281A.75.75,0,1,1,11.281.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.75.75,0,0,1-1.061,0Z" transform="translate(4.25 7.25)" fill="#141124" />
          </svg>
        </button>

        <button
          className="absolute right-[calc(50%-500px)] top-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md text-gray-600 hover:text-gray-800 transition-transform hover:scale-110 z-50"
          onClick={(e) => {
            e.stopPropagation();
            handleNextImage();
          }}
        >
          <svg width="64px" height="64px" viewBox="0 0 24 24" fill="#000000">
            <rect width="24" height="24" fill="#141124" opacity="0" />
            <path d="M10.22,9.28a.75.75,0,0,1,0-1.06l2.72-2.72H.75A.75.75,0,0,1,.75,4H12.938L10.22,1.281A.75.75,0,1,1,11.281.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.75.75,0,0,1-1.061,0Z" transform="translate(4.25 7.25)" fill="#141124" />
          </svg>
        </button>

        <div
          className="absolute bg-white rounded-xl shadow-2xl p-2 w-[90vw] max-w-[800px] h-[75vh] max-h-[600px] transition-all duration-300 ease-out animate-rise"
          style={{
            left: "50%",
            top: "60vh",
            transform: "translate(-50%, 0)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative  w-full h-full">
            <img
              src={imgUrl}
              alt={img.title || ""}
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-gray-600 hover:text-gray-800 transition-transform hover:scale-110"
              onClick={onClose}
            >
              <svg width="64px" height="64px" viewBox="0 0 24 24" fill="#000000">
                <rect width="24" height="24" fill="none" />
                <path d="M9.291,10.352l-4-4-4.005,4A.75.75,0,1,1,.22,9.291l4.005-4L.22,1.281A.75.75,0,0,1,1.281.22L5.286,4.225l4-4a.75.75,0,1,1,1.061,1.061l-4,4,4,4a.75.75,0,0,1-1.061,1.061Z" transform="translate(6.629 6.8)" fill="#141124" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="">
      <div className="flex justify-center w-full">
        <div className="w-[80%]">
          {isLoading ? (
            <div className="lg:text-left pl-[10%] mt-8 w-full top-6 mb-2">
              <div className="h-10 w-48 md:w-64 rounded bg-gray-200 animate-pulse" />
            </div>
          ) : (
            <div className="lg:text-center pl-[10%] text-red-500 lg:pl-[10%] mt-8 w-full top-6 text-2xl md:text-3xl font-semibold mb-2">
              ফটো গ্যালারী
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center lg:mt-[10px] mb-[20px] px-4 md:px-6 relative overflow-hidden">
        {/* Left Side Decorative SVG */}
        <div className="absolute left-0 z-0 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="108" height="100%" viewBox="0 0 108 1553" fill="none" className="min-h-full">
            <path d="M59.3578 0.108979C56.6367 87.8331 106.105 171.244 107.015 257.736C107.924 344.227 60.2746 433.8 55.4105 514.894C50.5464 595.988 36.2761 672.916 42.6007 753.386C48.9253 833.856 75.8438 917.866 80.1674 997.061C84.4909 1076.26 66.2205 1150.63 57.1142 1250.72C48.008 1350.8 48.068 1476.59 50.5539 1524.77C53.0398 1572.96 57.9516 1543.56 62.9335 1544.43L-1136.63 1516.93L-1140.13 2.88623L59.3578 0.108979Z" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="298.469" y1="-162.766" x2="-1809.29" y2="-157.886" gradientUnits="userSpaceOnUse">
                <stop offset="0.05" stopColor={primaryColor} stopOpacity="0.5" />
                <stop offset="0.95" stopColor={secondaryColor} stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Right Side Decorative SVG */}
        <div className="absolute right-0 z-0 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="112" height="100%" viewBox="0 0 112 1554" fill="none" className="min-h-full">
            <path d="M48.5347 0.108979C51.2557 87.8896 1.78707 171.354 0.877464 257.902C-0.0321373 344.449 47.6173 434.08 52.4813 515.226C57.3453 596.372 71.6154 673.35 65.2907 753.871C58.966 834.393 32.0474 918.458 27.7237 997.703C23.4001 1076.95 41.6704 1151.38 50.7765 1251.52C59.8826 1351.67 59.8224 1477.54 57.3364 1525.76C54.8505 1573.98 49.9387 1544.55 44.9568 1545.42L1244.52 1517.9L1248.02 2.88623L48.5347 0.108979Z" fill="url(#paint1_linear)" />
            <defs>
              <linearGradient id="paint1_linear" x1="-190.576" y1="-162.871" x2="1917.18" y2="-157.99" gradientUnits="userSpaceOnUse">
                <stop offset="0.05" stopColor={primaryColor} stopOpacity="0.5" />
                <stop offset="0.95" stopColor={secondaryColor} stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Grid overlay (subtle) */}
        <div
          className="absolute inset-0 w-full h-full 
          [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)] 
          [background-size:24px_24px] 
          [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_60%,transparent_100%)] 
          opacity-40"
        ></div>

        {/* Main Content */}
        <div className="w-[80%] relative z-10">
          <div className="relative max-w-[900px] mx-auto mb-8">
            <div className="absolute inset-0 z-0">
              <div className="h-full w-full">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                  <defs>
                    <pattern id="grid-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="4 2" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#grid-pattern)"
                    style={{ mask: 'radial-gradient(300px circle at center, white, transparent)' }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[950px] mx-auto relative z-10">
            {isLoading ? (
              <>
                <div className="space-y-10 mt-12">
                  {[0, 1].map((i) => (
                    <div key={i} className="w-full h-52">
                      <ShimmerThumbnail height={208} rounded className="w-full h-full bg-gray-200" />
                    </div>
                  ))}
                </div>
                <div className="space-y-10">
                  {[2, 3].map((i) => (
                    <div key={i} className="w-full h-52">
                      <ShimmerThumbnail height={208} rounded className="w-full h-full bg-gray-200" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-10 mt-12">
                  {images.slice(0, showAll ? Math.ceil(images.length / 2) : 2).map((img, idx) => {
                    const imgUrl = img.image || img.url || img.photo || img.img || "";
                    return (
                      <img
                        key={idx}
                        className={`w-full h-52 object-cover rounded-xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${selectedIndex !== null && selectedIndex !== idx ? "blur-sm" : ""}`}
                        src={imgUrl}
                        alt={img.title || ""}
                        onClick={() => handleImageClick(idx)}
                      />
                    );
                  })}
                </div>
                <div className="space-y-10">
                  {images.slice(showAll ? Math.ceil(images.length / 2) : 2, showAll ? images.length : 4).map((img, idx) => {
                    const realIdx = showAll ? Math.ceil(images.length / 2) + idx : 2 + idx;
                    const imgUrl = img.image || img.url || img.photo || img.img || "";
                    return (
                      <img
                        key={realIdx}
                        className={`w-full h-52 object-cover rounded-xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${selectedIndex !== null && selectedIndex !== realIdx ? "blur-sm" : ""}`}
                        src={imgUrl}
                        alt={img.title || ""}
                        onClick={() => handleImageClick(realIdx)}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center m-8">
            {isLoading ? (
              <div className="w-full md:w-80 px-6 py-3 mt-12 rounded inline-flex justify-center items-center gap-2.5">
                <div className="w-full h-10 rounded bg-gray-200 animate-pulse" />
              </div>
            ) : (
              <div
                onClick={() => setShowAll(!showAll)}
                className="w-full md:w-80 px-6 py-3 mt-12 rounded inline-flex justify-center items-center gap-2.5 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
                style={{ backgroundColor: buttonColor }}
              >
                <div className="justify-start text-white text-xl font-medium">
                  {showAll ? "কম দেখুন" : "আরও দেখুন"}
                </div>
                <div className="p-2 bg-white rounded-[100px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.14)] flex justify-start items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5.94141 13.2787L10.2881 8.93208C10.8014 8.41875 10.8014 7.57875 10.2881 7.06542L5.94141 2.71875" stroke="#141522" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popup */}
        <ImagePopup index={selectedIndex} onClose={handleClosePopup} />
      </div>
    </section>
  );
};

export default PhotoGallery2;