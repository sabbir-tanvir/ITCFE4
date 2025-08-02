import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { ShimmerButton, ShimmerText, ShimmerThumbnail } from "react-shimmer-effects";

const CARD_WIDTH = 260; // reduced width for mobile
const CARD_GAP = 16; // reduced gap for mobile: gap-4 = 16px

// Responsive visible cards based on screen size
const getVisibleCards = (screenWidth) => {
  if (screenWidth >= 850) return 3; // Above 850px - no arrows, show more cards or grid
  return 1; // Below 850px - show 1 card with arrows
};

const CourseCard = ({ card, buttonColor }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/course/${card.id}`, { state: { course: card } });
  };

  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[303px] mx-1 sm:mx-2 bg-white rounded-[16px] shadow-[1px_2px_12px_rgba(0,0,0,0.12)] hover:shadow-[0px_6px_25px_rgba(0,0,0,0.18)] transition-all duration-300 transform hover:scale-102 hover:-translate-y-1 flex flex-col">
      <div className="h-[180px] sm:h-[200px] md:h-[231px] w-full bg-[#DADBDE] rounded-t-[16px] flex items-center justify-center text-gray-500 text-lg sm:text-xl font-semibold overflow-hidden">
        {card.course_image ? (
          <img
            src={card.course_image}
            alt={card.title}
            className="object-cover w-full h-full rounded-t-[16px]"
          />
        ) : (
          <img
            src="/course.png"
            alt={card.title}
            className="object-cover w-full h-full rounded-t-[16px]"
          />
        )}
      </div>
      <div className="flex flex-col items-start justify-start gap-3 sm:gap-4 p-3 sm:p-4 w-full flex-grow">
        <div className="flex flex-col items-start justify-start gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-start justify-start gap-1 sm:gap-2 w-full">
            <div className="text-black text-[16px] sm:text-[18px] md:text-[20px] leading-6 font-semibold line-clamp-2">
              {card.title}
            </div>
            <div>
              <span className="text-[#96A0B0] text-[12px] sm:text-[14px] md:text-[16px] font-normal">
                মেয়াদ:{" "}
              </span>
              <span className="text-[#96A0B0] text-[12px] sm:text-[14px] md:text-[16px] font-normal font-[Inter]">
                {card.duration} মাস
              </span>
            </div>
          </div>
          <div className="text-black text-[12px] sm:text-[13px] md:text-[14px] font-medium line-clamp-2">
            ফি: {card.course_fee} টাকা
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 w-full">
      <button
        onClick={handleDetailsClick}
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

const CourseCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[303px] mx-1 sm:mx-2 bg-white rounded-[16px] shadow-[1px_2px_12px_rgba(0,0,0,0.12)] flex flex-col">
      {/* Image shimmer */}
      <div className="h-[180px] sm:h-[200px] md:h-[231px] w-full rounded-t-[16px] overflow-hidden">
        <ShimmerThumbnail height="100%" width="100%" rounded />
      </div>
      {/* Content shimmer */}
      <div className="flex flex-col items-start justify-start gap-3 sm:gap-4 p-3 sm:p-4 w-full flex-grow">
        <div className="flex flex-col items-start justify-start gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-start justify-start gap-1 sm:gap-2 w-full">
            {/* Title shimmer */}
            <div className="w-full">
              <ShimmerText line={2} gap={5} />
            </div>
            {/* Duration shimmer */}
            <div className="w-24 h-4 mt-1">
              <ShimmerText line={1} gap={5} />
            </div>
          </div>
          {/* Fee shimmer */}
          <div className="w-32 h-4">
            <ShimmerText line={1} gap={5} />
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

const OurCourses = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState(1);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [buttonColor, setButtonColor] = useState('#FC5D43');
  const [, setPrimaryColor] = useState('#FFFF');


  // Fetch button color from site settings
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.button_color) {
          setButtonColor(data.button_color);
        }
      })
      .catch(() => { });
  }, []);

  // Update visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setVisibleCards(getVisibleCards(width));
      setCurrentIndex(0); // Reset to first page when screen size changes
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${Api_Base_Url}/courses`, {
          headers: {
            Accept: "application/json",
            "Site-Id": Site_Id,
          },
        });
        const data = await response.json();
        setCourses(data.results || []);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleNext = () => {
    const limitedCourses = Math.min(courses.length, 8); // Limit to 8 courses
    if (isAnimating || limitedCourses <= visibleCards) return;
    setIsAnimating(true);
    const maxIndex = Math.max(0, limitedCourses - visibleCards);
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    const limitedCourses = Math.min(courses.length, 8); // Limit to 8 courses
    if (isAnimating || limitedCourses <= visibleCards) return;
    setIsAnimating(true);
    const maxIndex = Math.max(0, limitedCourses - visibleCards);
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Get only first 8 courses, and current visible ones in carousel
  const getCurrentCourses = () => {
    const limitedCourses = courses.slice(0, 8); // Limit to first 8 courses
    const startIndex = currentIndex;
    const endIndex = Math.min(startIndex + visibleCards, limitedCourses.length);
    return limitedCourses.slice(startIndex, endIndex);
  };


  // Fetch Primary color from site settings
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.primary_color) {
          setPrimaryColor(data.primary_color);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <div
      className="w-full relative">
      {/* Full-width white header with dotted background */}
      <div className="w-full h-[140px] relative py-10 mb-12">
        {/* Dotted background pattern */}
        <div className="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#F5F5F5_2px,transparent_1px)] [background-size:16px_16px]"></div>
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
              আমাদের কোর্স সমূহ
            </h2>
          )}
        </div>
      </div>

      {/* Course content container with grid background */}
      <div className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[100vw] mx-auto px-1 sm:px-4 pb-8 relative">
        {/* Grid gradient overlay inside course content */}
        <div className="absolute inset-0 w-full h-full 
          [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)] 
          [background-size:24px_24px] 
          [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_60%,transparent_100%)] 
          opacity-40 pointer-events-none z-0">
        </div>

        <div className="relative z-10">
          {/* ✅ Carousel for screens smaller than 850px */}
          {screenWidth < 850 && (
            <div className="relative w-full">
              <div
                className="flex items-center justify-between w-full gap-2 sm:gap-4"
                style={{ minHeight: "250px" }}
              >
                {/* Show arrows only if there are more courses than visible cards */}
                {courses.length > visibleCards && (
                  <button
                    onClick={handlePrev}
                    className="bg-[#FC5D43] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg z-20 flex-shrink-0"
                    style={{ backgroundColor: buttonColor }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                )}

                <div className="flex justify-center items-center flex-1 gap-4">
                  {loading ? (
                    <CourseCardSkeleton />
                  ) : (
                    <>
                      {getCurrentCourses().map((card) => (
                        <CourseCard key={card.id} card={card} buttonColor={buttonColor} />
                      ))}
                    </>
                  )}
                </div>

                {/* Show arrows only if there are more courses than visible cards */}
                {courses.length > visibleCards && (
                  <button
                    onClick={handleNext}
                    className="bg-[#FC5D43] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg z-20 flex-shrink-0"
                    style={{ backgroundColor: buttonColor }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ✅ Grid layout for screens 850px and above */}
          {screenWidth >= 850 && (
            <div className="flex flex-wrap justify-center gap-6 mb-12 w-full">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                    <CourseCardSkeleton key={index} />
                  ))}
                </>
              ) : (
                courses.slice(0, 8).map((card) => <CourseCard key={card.id} card={card} buttonColor={buttonColor} />)
              )}
            </div>
          )}

          <div className="flex justify-center mt-[60px] sm:mt-[80px] md:mt-[98px]">
            {loading ? (
              <div className="w-[240px] sm:w-[280px] md:w-[306px]">
                <ShimmerButton size="lg" />
              </div>
            ) : (
              <div
                className="w-[240px] sm:w-[280px] md:w-[306px] px-4 sm:px-5 md:px-6 py-2 sm:py-3 rounded flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: buttonColor }}
              >
                <Link to="/course" className="flex items-center gap-2">
                  <div className="text-white text-[16px] sm:text-[18px] md:text-[20px] font-medium">আরও দেখুন</div>
                  <IoIosArrowForward className="text-white text-[16px] sm:text-[18px] md:text-[20px]" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative SVG at bottom right corner - hidden on mobile */}

    </div>
  );
};

export default OurCourses;
