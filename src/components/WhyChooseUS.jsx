import { useEffect, useState } from "react";
import { Api_Base_Url, Site_Id } from "../config//api";
import { ShimmerText, ShimmerThumbnail } from "react-shimmer-effects";


const WhyChooseUS = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Array of local icons


  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${Api_Base_Url}/why-our-course`, {
      headers: {
        "Site-Id": Site_Id,
      },
    })
      .then((res) => res.json())
      .then((resData) => {

        setData(resData);
        setLoading(false);
      })
      .catch(() => {
        setError("ডেটা লোড করা যায়নি। দয়া করে পরে আবার চেষ্টা করুন।");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="mt-60 lg:mt-[45px] px-6 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-[95vw] mx-auto min-h-auto px-4 lg:px-16 relative">
          {/* Grid background overlay */}
          <div className="absolute inset-0 w-full h-full 
            [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)] 
            [background-size:24px_24px] 
            [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_60%,transparent_100%)] 
            opacity-40 pointer-events-none z-0">
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
            {/* Left Content Shimmer */}
            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
              <div className="space-y-4">
                {/* Title shimmer */}
                <div className="w-3/4 h-8">
                  <ShimmerText line={1} gap={10} />
                </div>
                {/* Description shimmer */}
                <div className="w-full">
                  <ShimmerText line={3} gap={5} />
                </div>
              </div>

              {/* Features shimmer */}
              <div className="space-y-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <ShimmerThumbnail height={30} width={30} rounded />
                    </div>
                    <div className="space-y-1 flex-1">
                      {/* Feature title shimmer */}
                      <div className="w-2/3 h-5">
                        <ShimmerText line={1} gap={5} />
                      </div>
                      {/* Feature description shimmer */}
                      <div className="w-full">
                        <ShimmerText line={2} gap={5} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Shimmer */}
            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[489px] rounded-lg overflow-hidden">
                <ShimmerThumbnail height="100%" width="100%" rounded />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="lg:mt-[45px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto min-h-[400px] flex items-center justify-center text-lg font-semibold text-red-600">
          {error || "ডেটা পাওয়া যায়নি।"}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 lg:mt-[45px] px-6 sm:px-6 lg:px-8 mb-4">
      <div className="max-w-[95vw] mx-auto min-h-auto px-4  lg:px-16 relative">
        {/* Grid background overlay */}
        <div className="absolute inset-0 w-full h-full 
          [background-image:linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)] 
          [background-size:24px_24px] 
          [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_60%,transparent_100%)] 
          opacity-40 pointer-events-none z-0">
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-black">
                {data.title}
              </h2>
              <p className="text-base sm:text-lg font-normal text-black">
                {typeof data.description === 'string'
                  ? data.description.replace(/<[^>]+>/g, '')
                  : ''}
              </p>
            </div>

            <div className="space-y-6">
              {Array.isArray(data.features) &&
                data.features.map((feature) => (
                  <div key={feature.id} className="flex items-start gap-4">
                    <div className=" flex-shrink-0 flex items-center justify-center">
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        className="w-[30px] h-[30px] object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-black">
                        {feature.title}
                      </h3>
                      <p className="text-base font-normal text-black">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[489px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
              {data.img && (
                <img
                  src={data.img}
                  alt="Why our course"
                  className="object-contain w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUS;
