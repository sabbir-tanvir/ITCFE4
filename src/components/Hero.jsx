import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { ShimmerButton, ShimmerText, ShimmerThumbnail } from "react-shimmer-effects";

const Hero = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonColor, setButtonColor] = useState('#FC5D43');
  const [primaryColor, setPrimaryColor] = useState(''); // orange-400 as default


  // Fetch colors from site settings
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.button_color) {
          setButtonColor(data.button_color);
        }
        if (data && data.secondary_color) {
          setPrimaryColor(data.secondary_color);
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

  if (loading) {
    return (
      <section className="w-full bg-white overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-20 relative overflow-hidden mx-auto">
          
          {/* Mobile Layout Shimmer */}
          <div className="block md:hidden py-8 space-y-6 min-h-[80vh]">
            {/* Title shimmer */}
            <div className="text-center pt-8">
              <div className="space-y-2">
                <div className="w-[200px] h-[28px] mx-auto bg-gray-200 rounded animate-pulse"></div>
                <div className="w-[250px] h-[28px] mx-auto bg-gray-200 rounded animate-pulse"></div>
                <div className="w-[180px] h-[28px] mx-auto bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Image shimmer */}
            <div className="flex justify-center">
              <div className="w-[90%] max-w-[350px] aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            {/* Content shimmer */}
            <div className="text-center space-y-4 px-2">
              <div className="max-w-md mx-auto space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-[90%] h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="w-[85%] h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="w-[75%] h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
              <div className="mt-4">
                <div className="w-32 h-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Desktop Layout Shimmer */}
          <div className="hidden md:block relative min-h-[50vh] lg:min-h-[60vh] xl:min-h-[100vh] pb-8 lg:pb-16">
            <div className="absolute top-[40px] lg:top-[61px] left-0 right-0 flex items-start h-auto">
              
              {/* Left Side - Content Shimmer */}
              <div className="w-1/2 space-y-4 lg:space-y-6 pl-[2%] lg:pl-[5%] xl:pl-0 pr-4 lg:pr-8 z-30">
                {/* Title shimmer */}
                <div className="space-y-3">
                  <div className="w-[300px] h-[40px] lg:w-[400px] lg:h-[50px] bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-[350px] h-[40px] lg:w-[450px] lg:h-[50px] bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-[250px] h-[40px] lg:w-[350px] lg:h-[50px] bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Subtitle shimmer */}
                <div className="max-w-[400px] lg:max-w-[500px] space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-[95%] h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-[90%] h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-[85%] h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Button shimmer */}
                <div className="mt-4">
                  <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Right Side - Image Shimmer */}
              <div className="w-1/2 flex justify-center pr-[2%] lg:pr-[5%] xl:pr-6 xl:pt-32 xl:mb-4">
                <div className="w-[280px] md:w-[300px] lg:w-[400px] xl:w-[500px] aspect-square bg-gray-200 rounded animate-pulse"></div>
              </div>
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

  // Title Splitting Logic
  const rawTitle = banner?.title || "আমাদের শিক্ষা কম্পিউটার ট্রেনিং সেন্টারে আপনাকে স্বাগতম";
  const titleParts = rawTitle.split(" ");
  const part1 = titleParts.slice(0, 2).join(" "); // "আমাদের শিক্ষা"
  const part2 = titleParts.slice(2, 5).join(" "); // "কম্পিউটার ট্রেনিং সেন্টারে"
  const part3 = titleParts.slice(5).join(" "); // "আপনাকে স্বাগতম"

  return (
    <section className="w-full overflow-x-hidden" style={{ backgroundColor: primaryColor }}>
      <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-20 relative overflow-hidden mx-auto">

        {/* Mobile Layout (< 768px) */}
        <div className="block md:hidden py-8 space-y-6 min-h-[80vh]">
          {/* Title */}
          <div className="text-center pt-8">
            <h1 className="text-[24px] sm:text-[28px] font-bold font-['Hind_Siliguri'] break-words">
              <span className="text-black block">{part1} </span>
              <span className="text-orange-600 block">{part2} </span>
              <span className="text-black block">{part3}</span>
            </h1>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <div className="relative w-[90%] max-w-[350px]">
              <img
                className="w-full h-auto object-cover rounded-xl shadow-md"
                src={banner?.image || "dude2.png"}
                alt="Hero"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4 px-2">
            <p className="text-black text-sm font-normal font-['Hind_Siliguri'] max-w-md mx-auto">
              {banner?.subtitle || "আমাদের শিক্ষা কম্পিউটার ট্রেনিং সেন্টার শিক্ষার্থীদের জন্য একটি উন্নত প্রশিক্ষণ কেন্দ্র, যেখানে কম্পিউটার প্রযুক্তি শিক্ষা ও পেশাগত উন্নয়নের সুযোগ প্রদান করে। এটি সফল ভবিষ্যতের জন্য গঠনমূলক ভিত্তি তার করে।"}
            </p>
            <div>
              {banner?.button_text && (
                <NavLink to={banner.button_url || "/course"}>
                  <div
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded shadow-[0px_4px_10px_0px_rgba(252,93,67,0.68)] hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1"
                    style={{ backgroundColor: buttonColor }}
                  >
                    <span className="text-white text-base font-semibold font-['Hind_Siliguri']">
                      {banner.button_text}
                    </span>
                  </div>
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Tablet and Desktop Layout (>= 768px) */}
        <div className="hidden md:block relative min-h-[50vh] lg:min-h-[60vh] xl:min-h-[100vh] pb-8 lg:pb-16">
          {/* Content Area - Flex Container */}
          <div className="absolute top-[40px] lg:top-[61px] left-0 right-0 flex items-start h-auto">
            
            {/* Left Side - Title + Text Content Section */}
            <div className="w-1/2 space-y-4 lg:space-y-6 pl-[2%] lg:pl-[5%] xl:pl-0 pr-4 lg:pr-8 z-30">
              {/* Title */}
              <div className="w-full">
                <h1 className="text-[30px] lg:text-[40px] xl:text-[50px] font-bold font-['Hind_Siliguri'] break-words text-left">
                  <span className="text-black block">{part1} </span>
                  <span className="text-orange-600 block">{part2} </span>
                  <span className="text-black block">{part3}</span>
                </h1>
              </div>
              
              {/* Subtitle */}
              <p className="text-black text-sm lg:text-base xl:text-lg font-normal font-['Hind_Siliguri'] leading-relaxed max-w-[400px] lg:max-w-[500px]">
                {banner?.subtitle || "আমাদের শিক্ষা কম্পিউটার ট্রেনিং সেন্টার শিক্ষার্থীদের জন্য একটি উন্নত প্রশিক্ষণ কেন্দ্র, যেখানে কম্পিউটার প্রযুক্তি শিক্ষা ও পেশাগত উন্নয়নের সুযোগ প্রদান করে। এটি সফল ভবিষ্যতের জন্য গঠনমূলক ভিত্তি তার করে।"}
              </p>
              
              {/* Button */}
              <div>
                {banner?.button_text && (
                  <NavLink to={banner.button_url || "/course"}>
                    <div
                      className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-3 rounded shadow-[0px_4px_10px_0px_rgba(252,93,67,0.68)] hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1"
                      style={{ backgroundColor: buttonColor }}
                    >
                      <span className="text-white text-sm lg:text-base font-semibold font-['Hind_Siliguri'] whitespace-nowrap">
                        {banner.button_text}
                      </span>
                    </div>
                  </NavLink>
                )}
              </div>
            </div>

            {/* Image Section - Right Half */}
            <div className="w-1/2 flex justify-center pr-[2%] lg:pr-[5%] xl:pr-20 xl:pt-32  xl:mb-4">
              <div className="relative w-[280px] md:w-[300px] lg:w-[400px] xl:w-[550px] h-auto">
                <img
                  className="w-full h-auto object-cover relative z-30"
                  src={banner?.image || "dude2.png"}
                  alt="Hero"
                />
              </div>
            </div>
          </div>

          {/* Decorative elements - hidden on screens smaller than 1280px */}
          <div className="hidden xl:block">
            <div className="w-28 h-32 absolute left-[-30px] top-[251px] origin-top-left rotate-[15.99deg] z-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="72" height="152" viewBox="0 0 72 152" fill="none">
                <path d="M35.48 149.45C-1.43765 109.266 45.6457 82.9422 56.6301 94.793C67.6144 106.644 28.1049 115.098 12.125 86.7577C1.47181 67.8639 -5.28964 44.8846 17.7783 23.8824L21.8019 20.2192L26.0938 16.3117L35.724 10.0665C47.7427 4.16942 62.3033 1.00625 71.1541 1.77861M35.48 149.45L25.9577 143.964M35.48 149.45L36.5711 142.496" stroke="#F48C06" strokeWidth="3" />
              </svg>
            </div>

            {/* Pink decorative box */}
            <div className="w-16 h-16 absolute right-[84px] top-[96px] z-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="14" fill="#F3627C" />
                <rect x="8" y="12" width="47.3" height="44.85" rx="8" fill="white" />
                <path d="M32 22V46" stroke="#F25471" strokeWidth="4" strokeLinecap="round" />
                <path d="M23.375 26.5V46" stroke="#F25471" strokeWidth="4" strokeLinecap="round" />
                <path d="M40.625 31.5V46" stroke="#F25471" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Cyan decorative box with building icon */}
            {/* <div className="w-12 h-12 absolute right-[184px] top-[203px] bg-cyan-400 rounded-lg z-30" />
            <div className="w-7 h-7 absolute right-[172px] top-[214px] overflow-hidden z-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                <g clipPath="url(#clip0_470_1859)">
                  <path d="M7.12474 0.25C6.5823 0.25 6.14258 0.68972 6.14258 1.23216V3.19643H8.10685V1.23216C8.10685 0.68972 7.66713 0.25 7.12474 0.25Z" fill="white" />
                  <path d="M20.8747 0.25C20.3323 0.25 19.8926 0.68972 19.8926 1.23216V3.19643H21.8568V1.23216C21.8569 0.68972 21.4172 0.25 20.8747 0.25Z" fill="white" />
                  <path d="M24.8036 3.19531H21.8571V7.1239C21.8571 7.66634 21.4174 8.10606 20.875 8.10606C20.3325 8.10606 19.8928 7.66634 19.8928 7.1239V3.19531H8.10712V7.1239C8.10712 7.66634 7.6674 8.10606 7.12496 8.10606C6.58252 8.10606 6.1428 7.66634 6.1428 7.1239V3.19531H3.19643C1.56916 3.19531 0.25 4.51447 0.25 6.14174V24.8025C0.25 26.4297 1.56916 27.7489 3.19643 27.7489H24.8036C26.4308 27.7489 27.75 26.4297 27.75 24.8025V6.14174C27.75 4.51447 26.4308 3.19531 24.8036 3.19531ZM25.7857 24.8025C25.7857 25.3449 25.346 25.7846 24.8035 25.7846H3.19643C2.65399 25.7846 2.21427 25.3449 2.21427 24.8025V12.0346H25.7857V24.8025Z" fill="white" />
                  <path d="M8.10659 14H6.14232C5.59988 14 5.16016 14.4397 5.16016 14.9822C5.16016 15.5246 5.59988 15.9643 6.14232 15.9643H8.10659C8.64903 15.9643 9.08875 15.5246 9.08875 14.9822C9.08875 14.4397 8.64903 14 8.10659 14Z" fill="white" />
                  <path d="M14.9816 14H13.0173C12.4749 14 12.0352 14.4397 12.0352 14.9822C12.0352 15.5246 12.4749 15.9643 13.0173 15.9643H14.9816C15.524 15.9643 15.9638 15.5246 15.9638 14.9822C15.9638 14.4397 15.524 14 14.9816 14Z" fill="white" />
                  <path d="M21.8566 14H19.8923C19.3499 14 18.9102 14.4397 18.9102 14.9822C18.9102 15.5246 19.3499 15.9643 19.8923 15.9643H21.8566C22.399 15.9643 22.8387 15.5246 22.8387 14.9822C22.8387 14.4397 22.399 14 21.8566 14Z" fill="white" />
                  <path d="M8.10659 17.9297H6.14232C5.59988 17.9297 5.16016 18.3694 5.16016 18.9118C5.16016 19.4543 5.59988 19.894 6.14232 19.894H8.10659C8.64903 19.894 9.08875 19.4543 9.08875 18.9118C9.08875 18.3694 8.64903 17.9297 8.10659 17.9297Z" fill="white" />
                  <path d="M14.9816 17.9297H13.0173C12.4749 17.9297 12.0352 18.3694 12.0352 18.9118C12.0352 19.4543 12.4749 19.894 13.0173 19.894H14.9816C15.524 19.894 15.9638 19.4543 15.9638 18.9118C15.9638 18.3694 15.524 17.9297 14.9816 17.9297Z" fill="white" />
                  <path d="M21.8566 17.9297H19.8923C19.3499 17.9297 18.9102 18.3694 18.9102 18.9118C18.9102 19.4543 19.3499 19.894 19.8923 19.894H21.8566C22.399 19.894 22.8387 19.4543 22.8387 18.9118C22.8387 18.3694 22.399 17.9297 21.8566 17.9297Z" fill="white" />
                  <path d="M8.10659 21.8594H6.14232C5.59988 21.8594 5.16016 22.2991 5.16016 22.8415C5.16016 23.384 5.59988 23.8236 6.14232 23.8236H8.10659C8.64903 23.8236 9.08875 23.3839 9.08875 22.8415C9.08875 22.299 8.64903 21.8594 8.10659 21.8594Z" fill="white" />
                  <path d="M14.9816 21.8594H13.0173C12.4749 21.8594 12.0352 22.2991 12.0352 22.8415C12.0352 23.384 12.4749 23.8237 13.0173 23.8237H14.9816C15.524 23.8237 15.9638 23.384 15.9638 22.8415C15.9638 22.2991 15.524 21.8594 14.9816 21.8594Z" fill="white" />
                  <path d="M21.8566 21.8594H19.8923C19.3499 21.8594 18.9102 22.2991 18.9102 22.8415C18.9102 23.384 19.3499 23.8237 19.8923 23.8237H21.8566C22.399 23.8237 22.8387 23.384 22.8387 22.8415C22.8387 22.2991 22.399 21.8594 21.8566 21.8594Z" fill="white" />
                </g>
                <defs>
                  <clipPath id="clip0_470_1859">
                    <rect width="27.5" height="27.5" fill="white" transform="translate(0.25 0.25)" />
                  </clipPath>
                </defs>
              </svg>
            </div> */}
          </div>

          {/* White background with curved orange cutout - hidden on screens smaller than 1280px */}
  
        </div>
                <div className="hidden xl:block">
            <div className="w-full h-[300px] absolute bottom-0 left-0 bg-white z-10" />
            <div className="w-full h-[250px] absolute bottom-16 left-0 z-20"
              style={{
                backgroundColor: primaryColor,
                borderRadius: '0 0 50% 50% / 0 0 100% 100%'
              }} />
          </div>
      </div>
      
    </section>




  );
};

export default Hero;
