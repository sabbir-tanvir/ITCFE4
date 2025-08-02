import { ShimmerButton, ShimmerText, ShimmerThumbnail } from "react-shimmer-effects";

const OurThoughtsSkeleton = () => {
  return (
    <section className="flex items-center justify-center min-h-[60vh] mt-[80px] mx-4 lg:pb-10 md:mt-[120px] lg:mt-[44px]">
      <div className="max-w-[1440px] w-full mx-auto px-4">
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-[145px] items-center justify-center w-full">
          {/* Left side - Our Talk section */}
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
            <div className="flex flex-col justify-center items-start gap-[2px]">
              {/* Title shimmer */}
              <div className="w-full lg:w-[618px] h-8">
                <ShimmerText line={1} gap={10} />
              </div>
              {/* Content shimmer - multiple lines */}
              <div className="w-full lg:w-[744px] mt-2">
                <ShimmerText line={5} gap={5} />
              </div>
            </div>
            {/* Button shimmer */}
            <div className="w-[180px] md:w-[205px] mt-4">
              <ShimmerButton size="md" />
            </div>
          </div>

          {/* Right side - Cards */}
          <div className="w-full lg:w-[372px] flex flex-col items-start gap-6 lg:gap-[24px]">
            {/* First row of cards */}
            <div className="grid grid-cols-2 gap-4 lg:gap-[24px] w-full">
              {/* Card 1 shimmer */}
              <div className="w-full p-2 bg-white flex flex-col items-center gap-[8px]">
                <div className="flex flex-col items-center gap-[4px]">
                  <ShimmerThumbnail height={40} width={40} rounded />
                  <div className="w-20 h-4">
                    <ShimmerText line={1} gap={5} />
                  </div>
                </div>
                <div className="w-full">
                  <ShimmerButton size="sm" />
                </div>
              </div>

              {/* Card 2 shimmer */}
              <div className="w-full p-2 bg-white flex flex-col items-center gap-[8px]">
                <div className="flex flex-col items-center gap-[4px]">
                  <ShimmerThumbnail height={40} width={40} rounded />
                  <div className="w-20 h-4">
                    <ShimmerText line={1} gap={5} />
                  </div>
                </div>
                <div className="w-full">
                  <ShimmerButton size="sm" />
                </div>
              </div>
            </div>

            {/* Second row of cards */}
            <div className="grid grid-cols-2 gap-4 lg:gap-[24px] w-full">
              {/* Card 3 shimmer */}
              <div className="w-full p-2 bg-white flex flex-col items-center gap-[8px]">
                <div className="flex flex-col items-center gap-[4px]">
                  <ShimmerThumbnail height={40} width={40} rounded />
                  <div className="w-20 h-4">
                    <ShimmerText line={1} gap={5} />
                  </div>
                </div>
                <div className="w-full">
                  <ShimmerButton size="sm" />
                </div>
              </div>

              {/* Card 4 shimmer */}
              <div className="w-full p-2 bg-white flex flex-col items-center gap-[8px]">
                <div className="flex flex-col items-center gap-[4px]">
                  <ShimmerThumbnail height={40} width={40} rounded />
                  <div className="w-20 h-4">
                    <ShimmerText line={1} gap={5} />
                  </div>
                </div>
                <div className="w-full">
                  <ShimmerButton size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurThoughtsSkeleton; 