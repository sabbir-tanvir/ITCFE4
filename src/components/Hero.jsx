import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { ShimmerButton, ShimmerText, ShimmerThumbnail } from "react-shimmer-effects";

const Hero = () => {
  const [banner, setBanner] = useState(null);
  const [bannerCards, setBannerCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonColor, setButtonColor] = useState('#FC5D43');
  const [primaryColor, setPrimaryColor] = useState('#FFFF');


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

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${Api_Base_Url}/banners`, {
      headers: {
        "Site-Id": Site_Id,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Banner Data:", data);

        if (Array.isArray(data) && data.length > 0) {
          setBanner(data[0]);
        } else {
          setError("No banner data found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load banner data.");
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    fetch(`${Api_Base_Url}/banner-cards`, {
      headers: {
        "Site-Id": Site_Id,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Banner cards:", data);
        if (Array.isArray(data) && data.length > 0) {
          setBannerCards(data);
        } else if (data.results && Array.isArray(data.results)) {
          setBannerCards(data.results);
        }
      })
      .catch((error) => {
        console.log("Error fetching banner cards:", error);
        setBannerCards([]); // Set empty array on error
      });
  }, []);



  if (loading) {
    return (
      <section className="w-full bg-white pt-8 pb-4 px-4 sm:px-6 lg:px-6">
        <div className="max-w-[1444px] lg:h-[600px] mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-16 relative">
          {/* Left: Image and badge shimmer */}
          <div className="relative flex-shrink-0 lg:mt-8 flex justify-center lg:justify-start w-full h-auto lg:h-[500px] lg:w-[520px]">
            <div className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[500px] aspect-square">
              <ShimmerThumbnail height={400} width="100%" rounded />
            </div>
            {/* Badge shimmer */}
            <div className="p-2 sm:p-3 absolute bg-white rounded-xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] inline-flex justify-start items-center gap-2 top-4 sm:top-4 md:top-8 right-0 lg:left-auto lg:right-[-40px]">
              <div className="w-12 h-12">
                <ShimmerThumbnail height={48} width={48} rounded />
              </div>
              <div className="flex flex-col justify-center items-start gap-1 w-56 sm:w-64">
                <div className="w-20 h-4">
                  <ShimmerText line={1} gap={5} />
                </div>
                <div className="w-full h-3">
                  <ShimmerText line={2} gap={5} />
                </div>
              </div>
            </div>
          </div>
          {/* Right: Text shimmer */}
          <div className="flex-1 flex flex-col justify-center items-start gap-3 pt-8 lg:pt-0">
            <div className="flex flex-col gap-2 w-full">
              {/* Title shimmer - multiple lines */}
              <div className="w-full max-w-2xl">
                <ShimmerText line={3} gap={10} />
              </div>
              {/* Subtitle shimmer */}
              <div className="w-full max-w-xl mt-2">
                <ShimmerText line={2} gap={5} />
              </div>
            </div>
            {/* Button shimmer */}
            <div className="mt-4">
              <ShimmerButton size="md" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1284px] mx-auto bg-red-100 text-red-700 rounded-[16px] p-8 text-center">
          {error}
        </div>
      </section>
    );
  }

  const imageSrc = banner?.image?.trim()
    ? banner.image
    : "";

  // Title Splitting Logic
  const rawTitle = banner?.title || "";
  const titleParts = rawTitle.split(" ");
  const part1 = titleParts.slice(0, 2).join(" "); // "আমাদের শিক্ষা"
   // "কম্পিউটার ট্রেনিং সেন্টারে"
  // "আপনাকে স্বাগতম"

  return (

    <section className="w-full bg-white pt-8 pb-4 px-4 sm:px-8  lg:m-0 lg:px-6">
      <div className="max-w-[1444px] lg:h-[600px] mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-16 relative">
        {/* Left: Image and badge */}
        <div className="relative flex-shrink-0 lg:mt-8 flex justify-center lg:justify-start w-full h-auto lg:h-[500px] lg:w-[520px]">
          <div className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[500px] aspect-square bg-indigo-300 rounded-2xl overflow-hidden relative flex items-end justify-center">
            {/* Top left larger circle */}
            <div className="absolute bg-indigo-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-38 lg:h-38" style={{ left: '-18px', top: '-18px' }} />
            {/* Bottom center much larger circle */}
            <div className="absolute bg-indigo-200 rounded-full w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80" style={{ left: '50%', bottom: '-52px', transform: 'translateX(-50%)' }} />
            {/* Student image, bottom aligned */}
            <img className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-auto h-[220px] sm:w-auto sm:h-[260px] md:w-auto md:h-[280px] lg:w-auto lg:h-[370px]" src="dude2.png" alt="Student" />
          </div>
          {/* Badge */}
          <div className="p-2 sm:p-3 absolute bg-white rounded-xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] inline-flex justify-start items-center gap-2 top-4 sm:top-4 md:top-8 right-8 lg:left-auto lg:right-[-40px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 60 60" fill="none">
              <path d="M50.0005 37.5C50.0005 42.1595 50.0005 44.489 49.2393 46.3268C48.2243 48.777 46.2775 50.7237 43.8273 51.7387C41.9895 52.5 39.6598 52.5 35.0005 52.5H27.5005C18.0725 52.5 13.3584 52.5 10.4294 49.571C7.50049 46.642 7.50054 41.928 7.50061 32.4997L7.50076 17.4996C7.50081 11.9769 11.9778 7.5 17.5004 7.5" stroke="#186D6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25.0005 21.25L26.0848 31.1722C26.1883 32.0017 26.698 32.7247 27.466 33.0547C29.181 33.7912 32.393 35 35.0005 35C37.6083 35 40.8203 33.7912 42.5353 33.0547C43.3033 32.7247 43.813 32.0017 43.9165 31.1722L45.0005 21.25M51.2505 18.75V28.173M35.0005 10L17.5006 17.5L35.0005 25L52.5005 17.5L35.0005 10Z" stroke="#186D6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex flex-col justify-center items-start gap-0.5 w-56 sm:w-64">
              <div className="flex flex-row flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-black text-base font-semibold font-['Noto_Sans_Bengali']">{bannerCards?.[0]?.title || "১৫+ কোর্স"}</span>
                <span className="text-black text-xs sm:text-sm font-medium font-['Hind_Siliguri'] whitespace-pre-line">{bannerCards?.[0]?.subtitle || "কম্পিউটার শিক্ষা, দক্ষতা উন্নয়ন ও পেশাগত প্রশিক্ষণ"}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Text  testing*/}
        <div className="flex-1 flex flex-col justify-center items-start gap-3 pt-8 lg:pt-0">
          <div className="flex flex-col gap-2">
            <div className="text-black text-3xl sm:text-4xl md:text-5xl font-semibold font-['Hind_Siliguri'] leading-tight">{banner?.title}</div>
            <div className="text-black text-base sm:text-lg font-normal font-['Hind_Siliguri'] max-w-xl">{banner?.subtitle}</div>
          </div>
          <div>
            {banner.button_text && (
              <NavLink to={banner.button_url || "/course"}>
                <div
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded shadow-[0px_4px_7px_rgba(255,0,0,0.71)] transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
                  style={{ backgroundColor: buttonColor }}
                >
                  <span className="text-white text-base font-semibold">
                    {banner.button_text}
                  </span>
                </div>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </section>




  );
};

export default Hero;
