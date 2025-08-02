import { useEffect, useState } from "react";
import { FaFilePdf, FaStar } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import {
  NavLink,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import clock from "../assets/Course Details logos/clock.png";
import wallet from "../assets/Course Details logos/wallet.png";
import GoogleReview from "../components/GoogleReview";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";

const CourseDetailsSkeleton = () => {
  return (
    <section className="w-full">
      <div className="w-full px-4 md:px-8 lg:px-16 max-w-[1440px] mx-auto py-8 md:py-12">
        <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-40">
          {/* Image skeleton */}
          <div className="w-full lg:w-1/2">
            <div className="w-full h-[300px] md:h-[378px] bg-gray-300 rounded-2xl shimmer animate-pulse"></div>
          </div>

          {/* Content skeleton */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-6">
              <div className="w-full flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  {/* Title skeleton */}
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="h-8 bg-gray-300 rounded w-3/4 shimmer animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 shimmer animate-pulse"></div>
                  </div>

                  {/* Instructor skeleton */}
                  <div className="inline-flex justify-start items-center gap-3">
                    <div className="w-14 h-14 bg-gray-300 rounded-full shimmer animate-pulse"></div>
                    <div className="inline-flex flex-col justify-start items-start gap-2">
                      <div className="h-5 bg-gray-300 rounded w-32 shimmer animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-24 shimmer animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Course info skeleton */}
                <div className="inline-flex justify-start items-center gap-4">
                  <div className="flex justify-start items-center gap-1">
                    <div className="w-6 h-6 bg-gray-300 rounded shimmer animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-20 shimmer animate-pulse"></div>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <div className="w-6 h-6 bg-gray-300 rounded shimmer animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-16 shimmer animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Description skeleton */}
              <div className="self-stretch space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full shimmer animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 shimmer animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-4/5 shimmer animate-pulse"></div>
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="w-full sm:w-52 h-12 bg-gray-300 rounded shimmer animate-pulse"></div>
              <div className="w-full sm:w-72 h-12 bg-gray-300 rounded shimmer animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const [buttonColor, setButtonColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAvailable, setFirebaseAvailable] = useState(false);


  // Check if Firebase is available
  useEffect(() => {
    const checkFirebaseConfig = async () => {
      try {
        const response = await fetch(`${Api_Base_Url}/firebase-config`, {
          headers: {
            "Site-Id": Site_Id
          },
        });
        if (response.ok) {
          const config = await response.json();
          if (config && Object.keys(config).length > 0) {
            setFirebaseAvailable(true);
          }
        }
      } catch {
        setFirebaseAvailable(false);
      }
    };
    checkFirebaseConfig();
  }, []);

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

  // Get course data from either loader or location state
  const courseFromLoader = loaderData;
  const courseFromState = location.state?.course;
  const course = courseFromLoader || courseFromState;

  const [instructor, setInstructor] = useState(null);

  // Debug: Log course object to see its structure
  // useEffect(() => {
  //   console.log("Course instructor properties:", {
  //     instructor_id: course?.instructor_id,
  //     instructor: course?.instructor,
  //     instructors: course?.instructors,
  //     instructorName: course?.instructorName,
  //     instructorTitle: course?.instructorTitle,
  //   });
  // }, [course]);

  // Set instructor from course data if available
  useEffect(() => {
    // Check if course has instructors array
    if (course?.instructors && course.instructors.length > 0) {
      setInstructor(course.instructors[0]); // Use first instructor
      // console.log(
      //   "Using instructor from instructors array:",
      //   course.instructors[0]
      // );
    } else if (course?.instructor) {
      setInstructor(course.instructor);
      // console.log("Using instructor from course data:", course.instructor);
    } else if (course?.instructor_id) {
      // Fetch instructor details if not already included
      const fetchInstructor = async () => {
        try {
          const response = await fetch(
            `${Api_Base_Url}/instructors/${course.instructor_id}/`,
            {
              headers: {
                "Site-Id": Site_Id,
              },
            }
          );
          if (response.ok) {
            const instructorData = await response.json();
            setInstructor(instructorData);
            // console.log("Fetched instructor data:", instructorData);
          }
        } catch (error) {
          console.error("Error fetching instructor:", error);
        }
      };

      fetchInstructor();
    }
  }, [course]);

  if (loading || !buttonColor) {
    return <CourseDetailsSkeleton />;
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Course not found</h2>
        <button
          onClick={() => navigate("/course")}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-[#145757]"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  // Review info: Only show if there are actual reviews (count > 0), not just a rating
  const hasReview =
    (course.reviews && typeof course.reviews.count === "number" && course.reviews.count > 0) ||
    (typeof course.reviewCount === "number" && course.reviewCount > 0);

  return (
    <section className="w-full ">
      <div className="w-full px-4 md:px-8 lg:px-16 max-w-[1440px] mx-auto py-8 md:py-12">
        <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-40">
          <div className="w-full lg:w-1/2">
            <img
              className="w-full h-auto rounded-2xl"
              src={
                course.course_image || "/course.png"
              }
              alt={course.title}
            />
          </div>
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="self-stretch inline-flex flex-col justify-start items-start gap-6">
              <div className="w-full flex flex-col justify-start items-start gap-4">
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch text-left justify-start">
                      <span className="text-black text-3xl font-semibold  ">
                        কোর্স{" "}
                      </span>
                      <span className="text-black text-3xl font-semibold font-['Inter']">
                        {course.id}
                      </span>
                      <span className="text-black text-3xl font-semibold  ">
                        : {course.title}
                      </span>
                    </div>
                    {/* Review section only if review exists */}
                    {hasReview && (
                      <div className="inline-flex justify-start items-center gap-1">
                        <div className="w-8 h-6 text-center justify-start text-black text-xl font-normal   leading-normal">
                          {course.average_rating ?? course.rating ?? 0}
                        </div>
                        <div className="w-6 h-6 relative">
                          <FaStar className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="text-center justify-start text-black text-xl font-normal   underline leading-normal">
                          (
                          {course.reviews && typeof course.reviews.count === "number" && course.reviews.count > 0
                            ? `${course.reviews.count}+ রিভিউ`
                            : course.reviewCount && course.reviewCount > 0
                            ? `${course.reviewCount}+ রিভিউ`
                            : "রিভিউ"}
                          )
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="inline-flex justify-start items-center gap-3">
                    {/* Instructor image clickable */}
                    <img
                      className="w-14 h-14 rounded-full hover:cursor-pointer"
                      src={instructor?.image || "https://placehold.co/56x56"}
                      alt="Instructor"
                      onClick={() => {
                        if (instructor?.id) {
                          navigate(`/trainer/${instructor.id}`);
                        }
                      }}
                    />
                    <div className="inline-flex flex-col justify-start items-start gap-0.5">
                      {/* Instructor name clickable */}
                      <div
                        className="justify-start text-zinc-900 text-xl font-bold cursor-pointer"
                        onClick={() => {
                          if (instructor?.id) {
                            navigate(`/trainer/${instructor.id}`);
                          }
                        }}
                      >
                        ইন্সট্রাক্টর:{" "}
                        {instructor?.name ||
                          course.instructorName ||
                          "তথ্য নেই"}
                      </div>
                      <div className="self-stretch justify-start text-zinc-600 text-base font-normal  ">
                        {instructor?.designation ||
                          course.instructorTitle ||
                          "তথ্য নেই"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inline-flex justify-start items-center gap-4">
                  <div className="flex justify-start items-center gap-1">
                    <img src={wallet} className="w-6 h-6" />
                    <div className="justify-start">
                      <span className="text-black text-base font-medium  ">
                        কোর্স ফি:{" "}
                      </span>
                      <span className="text-black text-base font-medium font-['Inter']">
                        {course.course_fee ?? course.price}
                      </span>
                      <span className="text-black text-base font-normal  ">
                        , টাকা
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <img src={clock} className="w-6 h-6 " />
                    <div className="justify-start">
                      <span className="text-black text-base font-medium  ">
                        সময়কাল:{" "}
                      </span>
                      <span className="text-black text-base font-medium font-['Hind_Madurai']">
                        {course.duration ?? course.validity}{" "}
                      </span>
                      <span className="text-black text-base font-medium  ">
                        মাস
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Course description */}
              <div className="self-stretch justify-start text-black text-base font-normal  ">
                {course.description ||
                  course.CourseFee ||
                  "কোর্সের বিস্তারিত বর্ণনা পাওয়া যায়নি।"}
              </div>
              {/* Instructor description */}
              {/* {instructor?.description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2  ">
                    ইন্সট্রাক্টর সম্পর্কে:
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base  ">
                    {instructor.description}
                  </p>
                </div>
              )} */}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="w-full sm:w-52 px-6 py-3 rounded flex justify-center items-center gap-2.5 transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
                style={{ backgroundColor: buttonColor }}>
                <div className="text-white text-base font-medium">
                  <NavLink to="/admission" state={{ course: course }}>রেজিস্ট্রেশন করুন</NavLink>
                </div>
              </button>
              {/* Course Material Download Button (replaces PDF) */}
              {course.course_material ? (
                <button
                  className="w-full sm:w-72 px-6 py-3 bg-white rounded border border-blue-600 flex justify-center items-center gap-2.5 hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => {
                    window.open(course.course_material, "_blank");
                  }}
                >
                  <FaFilePdf className="text-2xl text-blue-600" />
                  <div className="text-black text-base font-semibold">
                    কোর্স মেটেরিয়াল
                  </div>
                  <GoDownload className="text-blue-700" />
                </button>
              ) : (
                <div className="relative group">
                  <button
                    className="w-full sm:w-72 px-6 py-3 bg-gray-100 rounded border border-gray-300 flex justify-center items-center gap-2.5 cursor-not-allowed opacity-60"
                    disabled
                  >
                    <FaFilePdf className="text-2xl text-gray-400" />
                    <div className="text-gray-500 text-base font-semibold">
                      কোর্স মেটেরিয়াল উপলব্ধ নয়
                    </div>
                    <GoDownload className="text-gray-400" />
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    <div className="text-center">
                      <div>এই কোর্সের জন্য</div>
                      <div>কোর্স মেটেরিয়াল রিসোর্স উপলব্ধ নয়</div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 mb-8">
        {firebaseAvailable && (
          <GoogleReview courseId={course.id} reviewsData={course.reviews} />
        )}
      </div>
    </section>
  );
};

export default CourseDetails;


