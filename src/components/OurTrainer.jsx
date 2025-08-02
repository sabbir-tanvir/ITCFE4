import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { Api_Base_Url, Site_Id } from "../config/api";
import { ShimmerButton, ShimmerText, ShimmerThumbnail } from "react-shimmer-effects";

// Constants for card sizing and spacing (matching CourseCard responsive widths)
const CARD_WIDTH_MOBILE = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.95, 400) : 320; // 95vw, max 400px
const CARD_WIDTH_SM = 280;     // sm:w-[280px]
const CARD_WIDTH_MD = 303;     // md:w-[303px]
const CARD_GAP = 16;           // mx-2 (16px total gap between cards assuming mx-1 per card)

// Responsive visible trainers based on screen size (similar logic to getVisibleCards)
const getVisibleTrainers = (screenWidth) => {
  if (screenWidth >= 1024) return 3; // lg: 3 cards
  if (screenWidth >= 768) return 2;  // md: 2 cards
  return 1;                          // sm and below: 1 card
};

// Trainer Card Component (Styled like CourseCard)
const TrainerCard = ({ trainer, buttonColor, onOpenModal }) => {
  const fallbackImage = "/pfp.jpg";
  // Responsive card width and margin
  const cardClass =
    "flex-shrink-0 mb-8 bg-white rounded-[16px] shadow-[1px_2px_12px_rgba(0,0,0,0.12)] hover:shadow-[0px_6px_25px_rgba(0,0,0,0.18)] transition-all duration-300 transform hover:scale-102 hover:-translate-y-1 flex flex-col " +
    "w-full max-w-[95vw] mx-auto sm:w-[280px] sm:max-w-none sm:mx-2 md:w-[303px]";
  return (
    <div className={cardClass}>
      {/* Image Section */}
      <div className="h-[180px] sm:h-[200px] md:h-[231px] w-full bg-[#DADBDE] rounded-t-[16px] flex items-center justify-center text-gray-500 text-lg sm:text-xl font-semibold overflow-hidden">
        <img
          src={trainer.image || fallbackImage}
          alt={trainer.name}
          className="object-cover w-full h-full rounded-t-[16px]"
          onError={(e) => { e.target.src = ""; }} // Fallback on error
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-start justify-start gap-3 sm:gap-4 p-3 sm:p-4 w-full flex-grow">
        <div className="flex flex-col items-start justify-start gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-start justify-start gap-1 sm:gap-2 w-full">
            {/* Trainer Name */}
            <div className="text-black text-[16px] sm:text-[18px] md:text-[20px] leading-6 font-semibold line-clamp-2">
              {trainer.name}
            </div>
            {/* Designation */}
            <div className="text-[#96A0B0] text-[12px] sm:text-[14px] md:text-[16px] font-normal font-[Inter]">
              {trainer.designation}
            </div>
          </div>
        </div>
      </div>

      {/* Button Section */}
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 w-full">
        <button
          onClick={() => onOpenModal(trainer)}
          style={{ backgroundColor: buttonColor }}
          className="inline-flex items-center justify-center gap-[10px] rounded px-[16px] sm:px-[18px] md:px-[22px] py-[6px] sm:py-[8px] w-full transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
        >
          <div className="text-white text-[12px] sm:text-[14px] md:text-[16px] font-medium leading-[24px]">
            বিস্তারিত
          </div>
        </button>
      </div>
    </div>
  );
};

// Trainer Card Skeleton Component
const TrainerCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-full max-w-[95vw] mx-auto mb-8 sm:w-[280px] sm:max-w-none sm:mx-2 md:w-[303px] bg-white rounded-[16px] shadow-[1px_2px_12px_rgba(0,0,0,0.12)] flex flex-col">
      {/* Image shimmer */}
      <div className="h-[180px] sm:h-[200px] md:h-[231px] w-full rounded-t-[16px] overflow-hidden">
        <ShimmerThumbnail height="100%" width="100%" rounded />
      </div>
      {/* Content shimmer */}
      <div className="flex flex-col items-start justify-start gap-3 sm:gap-4 p-3 sm:p-4 w-full flex-grow">
        <div className="flex flex-col items-start justify-start gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-start justify-start gap-1 sm:gap-2 w-full">
            {/* Trainer name shimmer */}
            <div className="w-full">
              <ShimmerText line={2} gap={5} />
            </div>
            {/* Designation shimmer */}
            <div className="w-3/4 h-4 mt-1">
              <ShimmerText line={1} gap={5} />
            </div>
          </div>
        </div>
      </div>
      {/* Button shimmer */}
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 w-full">
        <ShimmerButton size="md" />
      </div>
    </div>
  );
};

const OurTrainer = () => {
  const [trainers, setTrainers] = useState([]);
  const [buttonColor, setButtonColor] = useState('#FC5D43'); // Default color
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleTrainers, setVisibleTrainers] = useState(1);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
   // Ref for potential scroll-based implementation

  // Fetch button color from site settings (similar to OurCourses)
  useEffect(() => {
    const cacheKey = 'siteSettingsCache';
    const cacheExpiry = 1000 * 60 * 60 * 6; // 6 hours
    const cached = localStorage.getItem(cacheKey);
    let color = null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < cacheExpiry) {
          if (parsed.button_color) color = parsed.button_color;
        }
      } catch (e) { /* ignore */ }
    }
    if (color) {
      setButtonColor(color);
    } else {
      // Fallback: fetch from backend if not in cache or expired
      fetchSiteSettings()
        .then((data) => {
          if (data && data.button_color) {
            setButtonColor(data.button_color);
          }
        })
        .catch(() => { });
    }
    // Always fetch latest in background to update cache
    fetchSiteSettings()
      .then((data) => {
        if (data && data.button_color) {
          setButtonColor(data.button_color);
        }
      })
      .catch(() => { });

  }, []);

  // Fetch trainers data
  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Api_Base_Url}/instructors`, {
          headers: {
            Accept: "application/json",
            "Site-Id": Site_Id,
          },
        });
        const data = await response.json();
        setTrainers(data.results || []);
      } catch (error) {
        console.error("Error fetching trainers:", error);
        setTrainers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  // Update visible trainers based on screen size (similar to OurCourses)
  useEffect(() => {
    const updateVisibleTrainers = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setVisibleTrainers(getVisibleTrainers(width));
      setCurrentIndex(0); // Reset to first page when screen size changes
    };
    updateVisibleTrainers();
    window.addEventListener('resize', updateVisibleTrainers);
    return () => window.removeEventListener('resize', updateVisibleTrainers);
  }, []);

  // Handle carousel navigation (similar to OurCourses)
  const handleNext = () => {
    if (isAnimating || trainers.length <= visibleTrainers) return;
    setIsAnimating(true);
    const maxIndex = Math.max(0, trainers.length - visibleTrainers);
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1)); // Wrap around or stop
    // Alternative non-wrap: setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    if (isAnimating || trainers.length <= visibleTrainers) return;
    setIsAnimating(true);
    const maxIndex = Math.max(0, trainers.length - visibleTrainers);
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1)); // Wrap around or stop
    // Alternative non-wrap: setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Reset animation flag after transition (similar to OurCourses)
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300); // Match transition duration if using transform
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Get the current visible trainers for mobile (below 640px)
  const getCurrentTrainers = () => {
    if (screenWidth < 640) {
      // Paginated: only show the current card
      return trainers.slice(currentIndex, currentIndex + 1);
    }
    // For larger screens, show all (slider logic)
    return trainers;
  };

  const openModal = (trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Calculate transform for slider effect (alternative to overflow-x-auto)
  const getTransformValue = () => {
    // Calculate width based on current breakpoint (approximation)
    let cardWidth = CARD_WIDTH_MOBILE;
    if (screenWidth >= 640) cardWidth = CARD_WIDTH_SM; // sm
    if (screenWidth >= 768) cardWidth = CARD_WIDTH_MD; // md
    // Total offset includes card width + gap
    const offset = currentIndex * (cardWidth + CARD_GAP);
    return `translateX(-${offset}px)`;
  };
    const fallbackImage = "/pfp.jpg"

  if (loading) {
    return (
      <section className="relative w-full max-w-[100vw] sm:max-w-[95vw] lg:max-w-[100vw] mx-auto px-4 sm:px-4 pb-8">
        {/* Header shimmer */}
        <div className="w-full h-[100px] sm:h-[110px] md:h-[110px] relative py-6 sm:py-8 md:py-10 mb-8 sm:mb-10 md:mb-12">
          <div className="absolute inset-0 w-full h-full
            [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)]
            [background-size:24px_24px]
            [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_60%,transparent_100%)]
            opacity-40">
          </div>
          <div className="relative z-10 w-full max-w-[80vw] mx-auto px-4">
            <div className="w-56 h-8 mx-auto">
              <ShimmerText line={1} gap={10} />
            </div>
          </div>
        </div>

        {/* Trainer content shimmer */}
        <div className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[100vw] mx-auto px-4 sm:px-4 pb-8 mb-4 relative">
          <div className="absolute inset-0 w-full h-full
            [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)]
            [background-size:24px_24px]
            [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_60%,transparent_100%)]
            opacity-40 pointer-events-none z-0">
          </div>
          <div className="relative z-10 w-full">
            {/* Carousel shimmer */}
            <div className="relative w-full">
              <div className="flex items-center justify-between w-full gap-4 sm:gap-4">
                {/* Left Arrow shimmer */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0">
                  <ShimmerThumbnail height="100%" width="100%" rounded />
                </div>

                {/* Trainer cards shimmer */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-4">
                    {/* Show responsive number of skeleton cards based on screen size */}
                    {Array.from({ length: getVisibleTrainers(typeof window !== 'undefined' ? window.innerWidth : 1024) }, (_, index) => (
                      <TrainerCardSkeleton key={index} />
                    ))}
                  </div>
                </div>

                {/* Right Arrow shimmer */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0">
                  <ShimmerThumbnail height="100%" width="100%" rounded />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-[100vw] sm:max-w-[95vw] lg:max-w-[100vw] mx-auto  sm:px-4 pb-8 "> {/* Adjusted padding */}
      {/* Full-width white header with dotted background (copied from OurCourses) */}
      <div className="w-full h-[100px] sm:h-[110px] md:h-[110px] relative py-6 sm:py-8 md:py-10 mb-8 sm:mb-10 md:mb-12"> {/* Adjusted height and padding */}
        {/* Dotted background pattern */}
        {/* Grid gradient overlay */}
        <div className="absolute inset-0 w-full h-full
          [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)]
          [background-size:24px_24px]
          [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_60%,transparent_100%)]
          opacity-40">
        </div>
        {/* Content overlay */}
        <div className="relative z-10 w-full max-w-[80vw] mx-auto px-4">
          {loading ? (
            <div className="w-56 h-8 mx-auto">
              <ShimmerText line={1} gap={10} />
            </div>
          ) : (
            <h2 className="text-center text-[#FC5D43] text-[22px] sm:text-[28px] md:text-[32px] font-semibold">
              আমাদের প্রশিক্ষক
            </h2>
          )}
        </div>
      </div>

      {/* Trainer content container with grid background (copied from OurCourses) */}
      <div
        className={`w-full mx-auto pb-8 mb-4 relative ${screenWidth < 640 ? 'max-w-[95vw] px-0' : screenWidth < 768 ? 'max-w-[90vw] px-0' : 'max-w-[100vw] sm:max-w-[90vw] lg:max-w-[100vw] sm:px-4'}`}
      >
        {/* Grid gradient overlay inside trainer content */}
        <div className="absolute inset-0 w-full h-full
          [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)]
          [background-size:24px_24px]
          [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_60%,transparent_100%)]
          opacity-40 pointer-events-none z-0">
        </div>
        <div className="relative z-10 w-full">
          {/* Carousel Container */}
          {screenWidth < 640 ? (
            <div className="relative w-full">
              <div className="flex items-center justify-between w-full gap-2" style={{ minHeight: "250px" }}>
                {/* Show arrows only if there are more trainers than 1 */}
                {trainers.length > 1 && (
                  <button
                    onClick={handlePrev}
                    className="bg-[#FC5D43] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg z-20 flex-shrink-0"
                    style={{ backgroundColor: buttonColor }}
                    aria-label="Previous Trainer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}
                <div className="flex justify-center items-center flex-1">
                  {loading ? (
                    <TrainerCardSkeleton />
                  ) : (
                    getCurrentTrainers().map((trainer) => (
                      <TrainerCard
                        key={trainer.id}
                        trainer={trainer}
                        buttonColor={buttonColor}
                        onOpenModal={openModal}
                      />
                    ))
                  )}
                </div>
                {trainers.length > 1 && (
                  <button
                    onClick={handleNext}
                    className="bg-[#FC5D43] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg z-20 flex-shrink-0"
                    style={{ backgroundColor: buttonColor }}
                    aria-label="Next Trainer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="relative w-full">
              <div className="flex items-center justify-between w-full gap-4 sm:gap-4">
                {/* Left Arrow - Always shown if there are trainers */}
                {trainers.length > 0 && (
                  <button
                    onClick={handlePrev}
                    disabled={isAnimating || trainers.length <= visibleTrainers}
                    className={`bg-[#FC5D43] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg z-20 flex-shrink-0 ${isAnimating || trainers.length <= visibleTrainers ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: buttonColor }}
                    aria-label="Previous Trainer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}
                {/* Slider Track */}
                <div className="flex-1 overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      transform: getTransformValue(),
                      width:
                        screenWidth < 768
                          ? `${trainers.length * (CARD_WIDTH_SM + CARD_GAP)}px`
                          : `${trainers.length * (CARD_WIDTH_MD + CARD_GAP)}px`,
                    }}
                  >
                    {trainers.map((trainer) => (
                      <TrainerCard
                        key={trainer.id}
                        trainer={trainer}
                        buttonColor={buttonColor}
                        onOpenModal={openModal}
                      />
                    ))}
                  </div>
                </div>
                {/* Right Arrow - Always shown if there are trainers */}
                {trainers.length > 0 && (
                  <button
                    onClick={handleNext}
                    disabled={isAnimating || trainers.length <= visibleTrainers}
                    className={`bg-[#FC5D43] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg z-20 flex-shrink-0 ${isAnimating || trainers.length <= visibleTrainers ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: buttonColor }}
                    aria-label="Next Trainer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for trainer details (unchanged) */}
      {/* Modal for trainer details */}
      {isModalOpen && selectedTrainer && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-white/80 backdrop-blur-sm px-2 pb-8 pt-[28vh] overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg w-full max-w-[335px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1022px] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full flex-1">
              

              <div className="w-full p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-xl md:text-3xl font-bold m-0">
                    আপনি যার কাছ থেকে শিখবেন
                  </h1>
                  <button
                    onClick={closeModal}
                    className="bg-[#FC5D43] flex items-center justify-center hover:bg-red-500 transition-colors duration-300"
                    aria-label="Close"
                    style={{
                      borderRadius: '100%',
                      width: '30px', height: '30px'
                    }}
                  >
                    <span className="text-white text-1xl font-bold">✕</span>
                  </button>
                </div>
                <div className="w-full mx-auto">
                  <div className="self-stretch p-4 md:p-6 rounded-xl outline outline-1 outline-offset-[-1px] outline-CTAColor bg-white min-h-[200px] md:min-h-[350px]">
                    <div className="clearfix min-h-[160px] md:min-h-[310px]">
                      <img
                        className="float-left w-20 h-20 sm:w-24 sm:h-24 md:w-52 md:h-80 rounded-2xl object-cover mr-3 sm:mr-4 md:mr-6 mb-4"
                        src={selectedTrainer.image || fallbackImage}
                        alt={selectedTrainer.name}
                        style={{ shapeOutside: 'margin-box', WebkitShapeOutside: 'margin-box' }}
                      />
                      <div className="flex flex-col justify-start items-start gap-0.5">
                        <div className="text-zinc-900 text-lg md:text-xl font-bold">
                          ইন্সট্রাক্টর: {selectedTrainer.name}
                        </div>
                        <div className="text-zinc-600 text-sm md:text-base">
                          {selectedTrainer.designation}
                        </div>
                      </div>
                      <div className="text-black text-sm md:text-base text-justify mt-2">
                        {selectedTrainer.description || (
                          <span className="text-gray-500 italic">
                            বর্ণনা পাওয়া যায়নি।
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OurTrainer;