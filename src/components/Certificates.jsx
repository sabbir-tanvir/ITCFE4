import { useEffect, useRef, useState } from "react";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";

// Import approval icons from assets

const Certificates = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [buttonColor, setButtonColor] = useState('#FC5D43');


      // Fetch button color from site settings
      useEffect(() => {
        fetchSiteSettings()
          .then((data) => {
            if (data && data.button_color) {
              setButtonColor(data.button_color);
            }
          })
          .catch(() => {});
      }, []);
    

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${Api_Base_Url}/approvals`, {
          headers: {
            "Site-Id": Site_Id,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch approvals");
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err.message || "Error fetching approvals");
      } finally {
        setLoading(false);
      }
    };
    fetchApprovals();
  }, []);

  // Responsive card count logic
  const getCardsPerView = () => {
    if (windowWidth < 640) return 1; // Small screens: 1 card
    if (windowWidth < 1024) return 2; // Medium screens: 2 cards
    return 3; // Large screens: 3 cards (unchanged)
  };

  const getGridClasses = () => {
    if (windowWidth < 640) return "grid-cols-1"; // Small screens: 1 column
    if (windowWidth < 1024) return "grid-cols-2"; // Medium screens: 2 columns
    return "grid-cols-3"; // Large screens: 3 columns (unchanged)
  };

  const cardsPerView = getCardsPerView();
  const gridClasses = getGridClasses();
  const shouldShowSlider = cards.length > cardsPerView;
  const visibleCards = shouldShowSlider
    ? cards.slice(currentIndex, currentIndex + cardsPerView)
    : cards;

  // Drag handlers
  const handleMouseDown = (e) => {
    if (!shouldShowSlider) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (!shouldShowSlider) return;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseUp = () => {
    if (!shouldShowSlider) return;
    const walk = dragOffset;
    if (Math.abs(walk) > 50) {
      if (walk > 0 && currentIndex > 0) {
        setCurrentIndex(Math.max(0, currentIndex - cardsPerView));
      } else if (walk < 0 && currentIndex + cardsPerView < cards.length) {
        setCurrentIndex(
          Math.min(cards.length - cardsPerView, currentIndex + cardsPerView)
        );
      }
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !shouldShowSlider) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = x - startX;
    setDragOffset(walk);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (!shouldShowSlider) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setDragOffset(0);
  };

  const handleTouchEnd = () => {
    if (!shouldShowSlider) return;
    const walk = dragOffset;
    if (Math.abs(walk) > 50) {
      if (walk > 0 && currentIndex > 0) {
        setCurrentIndex(Math.max(0, currentIndex - cardsPerView));
      } else if (walk < 0 && currentIndex + cardsPerView < cards.length) {
        setCurrentIndex(
          Math.min(cards.length - cardsPerView, currentIndex + cardsPerView)
        );
      }
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !shouldShowSlider) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = x - startX;
    setDragOffset(walk);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <section className="mt-[60px] mb-[30px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <div className="text-center text-black text-xl sm:text-2xl lg:text-3xl font-semibold">
            অনুমোদন সমূহ
          </div>
          <div className="text-center text-black text-sm sm:text-base lg:text-lg font-normal mt-2 px-2">
            আমাদের শিক্ষা কম্পিউটার ট্রেনিং সেন্টার এর সরকারি অনুমোদন সমূহ
          </div>
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            className={`flex flex-row justify-center items-start gap-8 transition-all duration-300 ease-out ${shouldShowSlider ? 'cursor-grab select-none' : ''}`}
            style={{
              transform: isDragging
                ? `translateX(${dragOffset * 0.3}px)`
                : "translateX(0)",
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {visibleCards.map((card, index) => {
              // If there are 3 cards, lift the middle one
              const isMiddle = visibleCards.length === 3 && index === 1;
              return (
                <div
                  key={currentIndex + index}
                  className={`w-56 p-6 bg-white rounded shadow-[0px_0px_5px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-center items-start gap-3${isMiddle ? ' -mt-6' : ''}`}
                >
                  <img
                    className="w-44 h-48"
                    src={card.organization_logo}
                    alt={card.organization_name}
                  />
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="justify-start text-black text-base font-semibold font-['Hind_Siliguri'] w-full">
                      {card.organization_name}
                    </div>
                    <div className="justify-start text-black text-sm font-medium font-['Hind_Siliguri'] w-full">
                      {card.memorial_number}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots indicator for slider */}
        {shouldShowSlider && (
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {Array.from(
              { length: Math.ceil(cards.length / cardsPerView) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * cardsPerView)}
                  style={i === Math.floor(currentIndex / cardsPerView) ? { backgroundColor: buttonColor } : {}}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                    i === Math.floor(currentIndex / cardsPerView)
                      ? ''
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
