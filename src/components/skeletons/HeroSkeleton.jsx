import Skeleton from "react-loading-skeleton";

const HeroSkeleton = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <section className="max-w-[1284px] mx-auto bg-primary rounded-[16px]">
        <section className="text-white p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row justify-between gap-6">
          <div className="font-nav lg:pl-9 w-full lg:w-1/2">
            <div className="w-full">
              {/* Title skeleton */}
              <div className="w-full mb-4">
                <Skeleton
                  height={45}
                  width="80%"
                  baseColor="#ffffff20"
                  highlightColor="#ffffff40"
                />
              </div>
              {/* Subtitle skeleton */}
              <div className="w-full mb-4">
                <Skeleton
                  height={18}
                  width="90%"
                  count={2}
                  baseColor="#ffffff20"
                  highlightColor="#ffffff40"
                />
              </div>
            </div>
            {/* Button skeleton */}
            <div className="navbar-start mt-4">
              <Skeleton
                height={48}
                width={120}
                baseColor="#ffffff20"
                highlightColor="#ffffff40"
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            {/* Image skeleton */}
            <div className="w-full h-auto relative mt-6 lg:mt-0 max-w-[500px] mx-auto lg:top-[85px] lg:left-[32px]">
              <Skeleton
                height={300}
                width="100%"
                baseColor="#ffffff20"
                highlightColor="#ffffff40"
              />
            </div>
          </div>
        </section>

        {/* Banner Cards skeleton */}
        <section className="relative top-3 lg:top-10">
          <div className="flex flex-col lg:flex-row gap-4 px-4 md:px-6 lg:px-9 pb-6">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="w-[280px] inline-flex items-center justify-start gap-2 p-3 bg-white rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
              >
                {/* Icon skeleton */}
                <div className="relative w-[60px] h-[60px] shrink-0">
                  <Skeleton
                    height={60}
                    width={60}
                    circle
                    baseColor="#e5e7eb"
                    highlightColor="#f3f4f6"
                  />
                </div>
                <div className="inline-flex flex-col items-center justify-center gap-[2px]">
                  {/* Title skeleton */}
                  <div className="self-stretch">
                    <Skeleton
                      height={16}
                      width={120}
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                  </div>
                  {/* Subtitle skeleton */}
                  <div className="w-full">
                    <Skeleton
                      height={14}
                      width={100}
                      baseColor="#e5e7eb"
                      highlightColor="#f3f4f6"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </section>
  );
};

export default HeroSkeleton;
