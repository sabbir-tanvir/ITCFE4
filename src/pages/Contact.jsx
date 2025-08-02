import React, { useEffect, useState } from "react";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { ShimmerText, ShimmerButton, ShimmerThumbnail } from "react-shimmer-effects";

const Contact = () => {
  const [result, setResult] = React.useState("");
  const [settings, setSettings] = useState(null);
  const [buttonColor, setButtonColor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');


  useEffect(() => {
    const cacheKey = 'siteSettingsCache';
    const cacheExpiry = 1000 * 60 * 60 * 6; // 6 hours

    // Try to get settings from cache first
    const cached = localStorage.getItem(cacheKey);
    let cachedSettings = null;

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < cacheExpiry) {
          cachedSettings = parsed;
        }
      } catch (e) {
        console.error("Error parsing cached settings:", e);
      }
    }

    if (cachedSettings) {
      setSettings(Array.isArray(cachedSettings.results) ? cachedSettings.results[0] : cachedSettings);
      if (cachedSettings.button_color) {
        setButtonColor(cachedSettings.button_color);
      }
      setLoading(false);
    }

    // Always fetch fresh data from backend
    fetchSiteSettings()
      .then((data) => {
        const settingsData = Array.isArray(data.results) ? data.results[0] : data;

        // Update state
        setSettings(settingsData);
        if (data.button_color) {
          setButtonColor(data.button_color);
        }

        // Update cache
        const cacheData = {
          ...settingsData,
          button_color: data.button_color,
          timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching site settings:", error);
        setLoading(false);
      });
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



  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("পাঠানো হচ্ছে...");
    const formData = new FormData(event.target);

    formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("ম্যাসেজ সফলভাবে পাঠানো হয়েছে");
        event.target.reset();
      } else {

        setResult(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setResult("ম্যাসেজ পাঠাতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন");
    }
  };

  // Helper to get Google Maps embed URL
  

  if (loading || !settings) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Left Column: Message Form Shimmer */}
          <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
            {/* Title shimmer */}
            <div className="mb-4 w-[150px]">
              <ShimmerText line={1} gap={10} />
            </div>

            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg space-y-4">
              {/* Form fields shimmer */}
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="space-y-2">
                  {/* Label shimmer */}
                  <div className="w-[80px]">
                    <ShimmerText line={1} gap={5} />
                  </div>
                  {/* Input shimmer */}
                  <div className={`w-full ${index === 4 ? 'h-[100px]' : 'h-[40px]'} bg-gray-200 rounded animate-pulse`}></div>
                </div>
              ))}

              {/* Button shimmer */}
              <div className="w-full h-[40px]">
                <ShimmerButton />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Info Shimmer */}
          <div className="w-full lg:w-1/2 px-4">
            {/* Title shimmer */}
            <div className="mb-4 w-[180px]">
              <ShimmerText line={1} gap={10} />
            </div>

            <div className="bg-gray-100 p-4 sm:p-6 rounded-lg space-y-4">
              {/* Contact items shimmer */}
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center space-x-3">
                  {/* Icon shimmer */}
                  <div className="w-6 h-6 bg-gray-300 rounded animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-1">
                    {/* Title shimmer */}
                    <div className="w-[60px]">
                      <ShimmerText line={1} gap={5} />
                    </div>
                    {/* Content shimmer */}
                    <div className="w-[200px]">
                      <ShimmerText line={1} gap={5} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section Shimmer */}
        <div className="mt-6 sm:mt-8">
          {/* Map title shimmer */}
          <div className="mb-4 w-[150px]">
            <ShimmerText line={1} gap={10} />
          </div>
          {/* Map shimmer */}
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-lg overflow-hidden">
            <ShimmerThumbnail height={450} rounded />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-wrap -mx-4">
        {/* Left Column: Message Form */}
        <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            আপনার ম্যাসেজ
          </h2>
          <form
            onSubmit={onSubmit}
            className="bg-gray-100 p-4 sm:p-6 rounded-lg"
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm sm:text-base text-gray-700 font-medium mb-2"
              >
                আপনার নাম
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-[#FC5D43] rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-[#FFEEEB]"
                placeholder="আপনার নাম লিখুন"
                style={{ backgroundColor: `${primaryColor}4D` }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm sm:text-base text-gray-700 font-medium mb-2"
              >
                ইমেইল
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-[#FC5D43] rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-[#FFEEEB]"
                placeholder="আপনার ইমেইল লিখুন"
                style={{ backgroundColor: `${primaryColor}4D` }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-sm sm:text-base text-gray-700 font-medium mb-2"
              >
                বিষয়
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                required
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-[#FC5D43] rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-[#FFEEEB]"
                placeholder="বিষয় লিখুন"
                style={{ backgroundColor: `${primaryColor}4D` }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm sm:text-base text-gray-700 font-medium mb-2"
              >
                ম্যাসেজ
              </label>
              <textarea
                name="message"
                id="message"
                required
                rows="4"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-[#FC5D43] rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-[#FFEEEB]"
                placeholder="আপনার ম্যাসেজ লিখুন"
                style={{ backgroundColor: `${primaryColor}4D` }}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full text-white py-2 px-4 text-sm sm:text-base rounded-md hover:opacity-90 transition duration-300"
              style={{ backgroundColor: buttonColor || '#FC5D43' }}
            >
              পাঠিয়ে দিন
            </button>
            {result && (
              <p
                className={`mt-4 text-center text-sm sm:text-base ${result === "ম্যাসেজ সফলভাবে পাঠানো হয়েছে"
                    ? 'text-green-600'
                    : "text-red-600"
                  }`}
              >
                {result}
              </p>
            )}
          </form>
        </div>

        {/* Right Column: Contact Info */}
        <div className="w-full lg:w-1/2 px-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            যোগাযোগের তথ্য
          </h2>
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0 3.517-1.045 6.79-3 9.5l1-11zM12 11c0 3.517 1.045 6.79 3 9.5l-1-11zM12 11a3 3 0 100-6 3 3 0 000 6z"
                />
              </svg>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                  ঠিকানা
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {settings?.address ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-red-700"
                    >
                      {settings.address}
                    </a>
                  ) : "বসুন্ধরা, ঢাকা"}
                </p>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z"
                />
              </svg>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                  মোবাইল নম্বর
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {settings?.phone ? (
                    <a
                      href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                      className="hover:underline text-red-700"
                    >
                      {settings.phone}
                    </a>
                  ) : "01888666619, 01867746587"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 9h18a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2v11a2 2 0 002 2z"
                />
              </svg>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                  ইমেইল
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {settings?.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="hover:underline text-red-700"
                    >
                      {settings.email}
                    </a>
                  ) : "amadershikkha@gmail.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section: Only show if map_iframe exists in settings */}
      {settings?.map_iframe && (
        <div className="mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            আমাদের অবস্থান
          </h2>
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-lg overflow-hidden">
            {(() => {
              const mapVal = String(settings.map_iframe).trim();
              if (mapVal.startsWith('<iframe')) {
                // Extract src attribute from iframe string
                const srcMatch = mapVal.match(/src=["']([^"']+)["']/i);
                const src = srcMatch ? srcMatch[1] : '';
                return (
                  <iframe
                    src={src}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                );
              } else {
                return (
                  <iframe
                    src={mapVal}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;