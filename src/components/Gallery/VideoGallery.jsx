

import { useEffect, useState } from "react";
import VideoModal from "./VideoModal";
import { fetchSiteSettings } from "../../config/siteSettingsApi";
import { useLoaderData } from "react-router-dom";
import { ShimmerThumbnail, ShimmerText } from "react-shimmer-effects";


const VideoGallery = () => {
  const loaderData = useLoaderData();
  // Debug: log the API response from /video-galleries
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [visibleVideos, setVisibleVideos] = useState(4); // State to manage the number of visible videos
  const [buttonColor, setButtonColor] = useState('#FC5D43');
  const [isLoading, setIsLoading] = useState(true);

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

  // Use videos from loaderData (API), fallback to empty array
  const allVideos = Array.isArray(loaderData?.results) ? loaderData.results : [];

  // Set loading state based on loaderData
  useEffect(() => {
    if (loaderData && Array.isArray(loaderData.results)) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [loaderData]);


  // Helper to extract YouTube embed URL if needed
  const getEmbedUrl = (url) => {
    if (!url) return "";
    // If already an embed URL, return as is
    if (url.includes("/embed/")) return url;
    // Convert YouTube watch URL to embed
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  const openModal = (url) => {
    setVideoUrl(getEmbedUrl(url));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setVideoUrl(""); // Clear video URL on close
  };

  const loadMoreVideos = () => {
    setVisibleVideos((prevVisibleVideos) => prevVisibleVideos + 4); // Load 4 more videos
  };

  const displayedVideos = allVideos.slice(0, visibleVideos);

  return (
    <div className="relative mx-auto px-4 py-8 overflow-hidden max-w-7xl">
      {/* Grid pattern background */}
      <div className="absolute inset-0 w-full h-full 
        [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)] 
        [background-size:24px_24px] 
        [mask-image:radial-gradient(ellipse_50%_70%_at_50%_70%,#fff_60%,transparent_100%)] 
        opacity-40 pointer-events-none z-0">
      </div>
      <div className="relative z-10">
        {/* Section Title Shimmer */}
        {isLoading ? (
          <div className="mb-4 mt-8">
            <div className="h-10 w-64 rounded bg-gray-200 animate-pulse" />
          </div>
        ) : (
          <h2 className="text-4xl text-center font-bold mb-4 mt-8 text-black">
            ভিডিও গ্যালারী
          </h2>
        )}
        {/* Video Cards Shimmer or Real */}
        <div className="flex flex-wrap justify-center gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden w-full sm:w-[340px] md:w-[370px] lg:w-[480px]"
                style={{ margin: '8px' }}
              >
                <div className="relative">
                  <ShimmerThumbnail height={220} rounded className="aspect-video w-full bg-gray-200" />
                </div>
                <div className="pt-2 pb-3">
                  <ShimmerText line={1} gap={0} className="w-3/4 h-6 mx-auto bg-gray-200" />
                </div>
              </div>
            ))
            : displayedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-md overflow-hidden w-full sm:w-[340px] md:w-[370px] lg:w-[480px] transition-all duration-300 transform hover:scale-102 hover:-translate-y-1 hover:shadow-lg"
                style={{ margin: '8px' }}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="aspect-video rounded-lg w-full object-cover cursor-pointer"
                    onClick={() => openModal(video.video_url)}
                    style={{ minHeight: '180px', maxHeight: '260px' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="rounded-full p-2 cursor-pointer"
                      style={{ backgroundColor: buttonColor }}
                      onClick={() => openModal(video.video_url)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="pt-2 pb-3">
                  <h3 className="text-base font-semibold text-center text-gray-800">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
        </div>
        {/* Button shimmer or real */}
        {isLoading ? (
          <div className="flex justify-center mt-14 mb-[200px]">
            <div className="w-full md:w-80 px-6 py-3 rounded-full mt-12 flex justify-center items-center gap-2.5">
              <div className="w-full h-10 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        ) : (
          visibleVideos < allVideos.length && (
            <div className="flex justify-center mt-14 mb-[200px]">
              <button
                className="text-white font-bold py-2 px-6 rounded-full flex items-center transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
                style={{ backgroundColor: buttonColor }}
                onClick={loadMoreVideos}
              >
                আরও দেখুন
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )
        )}
        {/* Video Modal */}
        <VideoModal
          isOpen={isModalOpen}
          videoUrl={videoUrl}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};
export default VideoGallery;