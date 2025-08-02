import React, { useEffect, useState } from "react";
import image1 from "../assets/ourWork/1.jpg";
import image2 from "../assets/ourWork/2.jpg";
import image3 from "../assets/ourWork/3.jpg";
import image4 from "../assets/ourWork/4.jpg";
import { Api_Base_Url, Site_Id } from "../config//api";

const OurWork = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [activities, setActivities] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  // Fallback images array
  const fallbackImages = [image1, image2, image3, image4];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${Api_Base_Url}/activities`, {
        headers: {
          "Site-Id": Site_Id,
        },
      });
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setActivities(data.results);
      } else {
        // If no API data, use fallback images
        setActivities([
          { id: 1, title: "Activity 1", image: image1 },
          { id: 2, title: "Activity 2", image: image2 },
          { id: 3, title: "Activity 3", image: image3 },
          { id: 4, title: "Activity 4", image: image4 },
        ]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      // Use fallback images on error
      setActivities([
        { id: 1, title: "Activity 1", image: image1 },
        { id: 2, title: "Activity 2", image: image2 },
        { id: 3, title: "Activity 3", image: image3 },
        { id: 4, title: "Activity 4", image: image4 },
      ]);
    }
  };

  const handleImageError = (activityId) => {
    setImageErrors((prev) => ({
      ...prev,
      [activityId]: true,
    }));
  };

  const getImageSource = (activity, index) => {
    // If image failed to load, use fallback
    if (imageErrors[activity.id]) {
      return fallbackImages[index % fallbackImages.length];
    }
    return activity.image;
  };

  const handleImageClick = (image, event) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSelectedImage(image);
  };

  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  // Get the images to display (first 4 for initial view, all for expanded view)
  const displayActivities = showAll ? activities : activities.slice(0, 4);
  const leftColumnActivities = displayActivities.filter(
    (_, index) => index % 2 === 0
  );
  const rightColumnActivities = displayActivities.filter(
    (_, index) => index % 2 === 1
  );

  // Responsive helpers
  const isMd = typeof window !== "undefined" && window.innerWidth >= 768;
  const isLgRange =
    typeof window !== "undefined" &&
    window.innerWidth >= 1024 &&
    window.innerWidth <= 1366;
  const isSm = typeof window !== "undefined" && window.innerWidth < 600;

  // Title style
  const titleStyle = isMd
    ? { left: "50%", transform: "translateX(-50%)", maxWidth: "90vw" }
    : {};

  // Popup style
  const popupStyle = {
    left: popupPosition.x,
    top: popupPosition.y,
    transform: "translate(-50%, -50%)",
    width: isSm ? "90vw" : "500px",
    height: isSm ? "auto" : "300px",
    maxHeight: isSm ? "70vh" : "300px",
  };

  return (
    <section className="grid items-center mt-[100px] px-4 md:px-6">
      <div
        className={`relative ${
          showAll ? "h-[1600px]" : "h-[815px]"
        } max-w-[1200px] mx-auto w-full`}
      >
        <div
          className="text-center text-black text-2xl md:text-3xl font-semibold mb-8 md:mb-0 md:absolute md:top-[27px]"
          style={titleStyle}
        >
          আমাদের কার্যক্রম সমূহ
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-20 md:gap-y-0 md:absolute md:left-0 md:right-0">
          {/* Left Column */}
          <div className="ml-0 lg:ml-32">
            <div className="space-y-6 md:space-y-0 ">
              {leftColumnActivities.map((activity, index) => {
                const imgClass = [
                  "w-full",
                  "h-52",
                  isMd ? "md:w-[352px] lg:w-[452px] md:absolute" : "",
                  "object-cover",
                  "rounded-xl",
                  "shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]",
                  "cursor-pointer",
                  "transition-all",
                  "duration-300",
                  selectedImage &&
                  selectedImage !== getImageSource(activity, index * 2)
                    ? "blur-sm"
                    : "",
                ].join(" ");
                const imgStyle = isMd
                  ? {
                      top: `${139 + index * 284}px`,
                      left: isLgRange ? "50%" : undefined,
                      transform: isLgRange ? "translateX(-110%)" : undefined,
                    }
                  : {};
                return (
                  <img
                    key={activity.id}
                    className={imgClass}
                    style={imgStyle}
                    src={getImageSource(activity, index * 2)}
                    alt={activity.title}
                    onClick={(e) =>
                      handleImageClick(getImageSource(activity, index * 2), e)
                    }
                    onError={() => handleImageError(activity.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 md:space-y-0">
            {rightColumnActivities.map((activity, index) => {
              const imgClass = [
                "w-full",
                "h-52",
                isMd ? "md:w-[352px] lg:w-[452px] md:absolute" : "",
                "object-cover",
                "rounded-xl",
                "shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]",
                "cursor-pointer",
                "transition-all",
                "duration-300",
                selectedImage &&
                selectedImage !== getImageSource(activity, index * 2 + 1)
                  ? "blur-sm"
                  : "",
              ].join(" ");
              const imgStyle = isMd
                ? {
                    top: `${98 + index * 284}px`,
                    left: isLgRange ? "50%" : undefined,
                    transform: isLgRange ? "translateX(10%)" : undefined,
                  }
                : {};
              return (
                <img
                  key={activity.id}
                  className={imgClass}
                  style={imgStyle}
                  src={getImageSource(activity, index * 2 + 1)}
                  alt={activity.title}
                  onClick={(e) =>
                    handleImageClick(getImageSource(activity, index * 2 + 1), e)
                  }
                  onError={() => handleImageError(activity.id)}
                />
              );
            })}
          </div>
        </div>

        {activities.length > 4 && (
          <div
            onClick={() => setShowAll(!showAll)}
            className={`w-full md:w-80 px-6 py-3 mt-6 md:mt-0 md:absolute bg-teal-700 rounded inline-flex justify-center items-center gap-2.5 cursor-pointer ${
              showAll ? "md:top-[1300px]" : "md:top-[725px]"
            } md:left-[467px]`}
          >
            <div className="justify-start text-white text-xl font-medium  ">
              {showAll ? "কম দেখুন" : "আরও দেখুন"}
            </div>
            <div className="p-2 bg-white rounded-[100px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.14)] flex justify-start items-center gap-2.5">
              <div className="w-4 h-4 relative">
                <div className="w-[4.73px] h-2.5 left-[5.94px] top-[2.72px] absolute outline outline-1 outline-offset-[-0.50px] outline-gray-900" />
                <div className="w-4 h-4 left-[16px] top-[16px] absolute origin-top-left -rotate-180 opacity-0" />
              </div>
            </div>
          </div>
        )}
      </div>
      <ImagePopup image={selectedImage} onClose={handleClosePopup} />
    </section>
  );

  function ImagePopup({ image, onClose }) {
    if (!image) return null;
    return (
      <div className="fixed inset-0 z-50" onClick={onClose}>
        <div
          className="absolute bg-white rounded-xl shadow-2xl p-2 transition-all duration-300 ease-out animate-rise"
          style={popupStyle}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover rounded-lg"
            style={{ maxHeight: isSm ? "60vh" : "100%" }}
          />
          <button
            className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md text-gray-600 hover:text-gray-800 transition-transform hover:scale-110"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
    );
  }
};

export default OurWork;
