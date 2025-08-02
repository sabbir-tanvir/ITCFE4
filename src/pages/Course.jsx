import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { fetchSiteSettings } from "../config/siteSettingsApi";

const CourseCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[303px] mx-2 bg-white rounded-[16px] shadow-[1px_2px_12px_rgba(0,0,0,0.12)] flex flex-col animate-pulse">
      <div className="h-[200px] sm:h-[231px] w-full bg-gray-300 rounded-t-[16px] shimmer"></div>
      <div className="flex flex-col items-start justify-start gap-3 sm:gap-4 p-3 sm:p-4 w-full flex-grow">
        <div className="flex flex-col items-start justify-start gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-start justify-start gap-1 sm:gap-2 w-full">
            <div className="h-6 bg-gray-300 rounded w-3/4 shimmer"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 shimmer"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-2/3 shimmer"></div>
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 w-full">
        <div className="h-10 bg-gray-300 rounded w-full shimmer"></div>
      </div>
    </div>
  );
};

const CourseCard = ({ course, buttonColor }) => {
  const navigate = useNavigate();
  const handleDetailsClick = () => {
    navigate(`/course/${course.id}`, { state: { course } });
  };
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[303px] mx-2 bg-white rounded-[16px] shadow-[1px_2px_12px_rgba(0,0,0,0.12)] hover:shadow-[0px_6px_25px_rgba(0,0,0,0.18)] transition-all duration-300 transform hover:scale-102 hover:-translate-y-1 flex flex-col">
      <div className="h-[200px] sm:h-[231px] w-full bg-[#DADBDE] rounded-t-[16px] flex items-center justify-center text-gray-500 text-lg sm:text-xl font-semibold overflow-hidden">
        {course.course_image ? (
          <img
            src={course.course_image}
            alt={course.title}
            className="object-cover w-full h-full rounded-t-[16px]"
          />
        ) : (
          <img
            src="/course.png"

            className="object-cover w-full h-full rounded-t-[16px]"
          />
        )}
      </div>
      <div className="flex flex-col items-start justify-start gap-3 sm:gap-4 p-3 sm:p-4 w-full flex-grow">
        <div className="flex flex-col items-start justify-start gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-start justify-start gap-1 sm:gap-2 w-full">
            <div className="text-black text-[18px] sm:text-[20px] leading-6 font-semibold line-clamp-2">
              {course.title}
            </div>
            <div>
              <span className="text-[#96A0B0] text-[14px] sm:text-[16px] font-normal">
                মেয়াদ:{" "}
              </span>
              <span className="text-[#96A0B0] text-[14px] sm:text-[16px] font-normal font-[Inter]">
                {course.duration} মাস
              </span>
            </div>
          </div>
          <div className="text-black text-[13px] sm:text-[14px] font-medium line-clamp-2">
            ফি: {course.course_fee} টাকা
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 w-full">
        <button
          onClick={handleDetailsClick}
          className="inline-flex items-center justify-center gap-[10px] rounded px-[18px] sm:px-[22px] py-[6px] sm:py-[8px] w-full transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
          style={{ backgroundColor: buttonColor }}
        >
          <div className="text-white text-[14px] sm:text-[16px] font-medium leading-[24px]">
            বিস্তারিত
          </div>
        </button>
      </div>
    </div>
  );
};

const Course = () => {
  const coursesData = useLoaderData();
  const [buttonColor, setButtonColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8); // Show 8 courses initially

  const courses = coursesData?.results || [];

  // Get button color from localStorage cache (set by Home)
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
      setLoading(false);
    } else {
      // fallback: fetch from backend
      fetchSiteSettings()
        .then((data) => {
          if (data && data.button_color) {
            setButtonColor(data.button_color);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
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

  if (loading || !buttonColor) {
    return (
      <div className="w-full px-4 py-8">
        <h2 className="text-center text-black text-[32px] font-semibold mb-6">
          আমাদের কোর্স সমূহ
        </h2>
        <div className="flex flex-wrap justify-center gap-6 min-h-[300px]">
          {Array.from({ length: 8 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const displayedCourses = courses.slice(0, visibleCount);
  const hasMore = courses.length > 8;

  const handleSeeMore = () => {
    setVisibleCount(courses.length); // Show all
  };

  return (
    <div className="w-full px-4 py-8">
      <h2 className="text-center text-black text-[32px] font-semibold mb-6">
        আমাদের কোর্স সমূহ
      </h2>
      <div className="flex flex-wrap justify-center gap-6 min-h-[300px]">
        {courses.length > 0 ? (
          displayedCourses.map((course) => (
            <CourseCard key={course.id} course={course} buttonColor={buttonColor} />
          ))
        ) : (
          <div className="text-gray-500">কোনো কোর্স পাওয়া যায়নি</div>
        )}
      </div>

      {/* Show "See More" only if more than 8 courses exist */}
      {hasMore && visibleCount === 8 && (
        <div className="flex justify-center mt-[98px]">
          <button
            onClick={handleSeeMore}
            className="w-[306px] px-6 py-3 rounded flex items-center justify-center gap-2 inline-flex transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
            style={{ backgroundColor: buttonColor }}
          >
            <div className="text-white text-[20px] font-medium">আরও দেখুন</div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Course;