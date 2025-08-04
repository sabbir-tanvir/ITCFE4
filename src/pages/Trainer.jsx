import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ShimmerSimpleGallery } from 'react-shimmer-effects';

const Trainer = () => {
  const data = useLoaderData();
  const trainers = data?.results || [];

  const [visibleTrainers, setVisibleTrainers] = useState(6);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonColor, setButtonColor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch site settings directly (no caching)
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.button_color) {
          setButtonColor(data.button_color);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleShowMore = () => {
    setVisibleTrainers(trainers.length);
  };

  const openModal = (trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fallbackImage = "/pfp.jpg"

  if (loading || !buttonColor) {
    return (
      <section className="relative w-full max-w-none px-2 sm:px-4 lg:py-12 lg:mt-20">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 relative z-10">প্রশিক্ষক</h1>
        <ShimmerSimpleGallery card row={2} col={3} gap={30} caption imageHeight={192} />
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-none px-8 sm:px-14 mt-10 lg:px-24 justify-center lg:py-4 lg:mt-6">
      {/* Background Pattern - Lower Left */}
      <div className="absolute bottom-10  opacity-20 pointer-events-none z-0">
        <div className="relative h-40 w-96 [&>div]:absolute [&>div]:h-full [&>div]:w-full [&>div]:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [&>div]:[background-size:16px_16px] [&>div]:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
          <div></div>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-8 relative z-10">প্রশিক্ষক</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
        {trainers.slice(0, visibleTrainers).map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white  rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-102 hover:-translate-y-1"
          >
            <img
              src={trainer.image || fallbackImage}
              alt={trainer.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h2 className="text-lg md:text-xl font-semibold mb-1">
                {trainer.name}
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-4">
                {trainer.designation}
              </p>
              <button
                onClick={() => openModal(trainer)}
                className="text-white py-2 px-4 rounded hover:bg-red-500 transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90"
                style={{ backgroundColor: buttonColor }}
              >
                বিস্তারিত
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleTrainers < trainers.length && (
        <div className="relative text-center mb-14 mt-12 z-10">
          <button
            onClick={handleShowMore}
            className="text-white py-2 px-6 rounded hover:bg-red-500 transition-all duration-200 transform hover:-translate-y-1 hover:opacity-90 relative z-10"
            style={{ backgroundColor: buttonColor }}
          >
            আরও দেখুন
          </button>
        </div>
      )}

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

export default Trainer;


