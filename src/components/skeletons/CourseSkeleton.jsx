import Skeleton from "react-loading-skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-[250px] sm:w-[250px] lg:w-[282px] bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col transition-all hover:shadow-lg mb-6">
      {/* Image skeleton */}
      <div className="h-[200px] sm:h-[231px] w-full bg-[#DADBDE] rounded-t-[16px] flex items-center justify-center overflow-hidden">
        <Skeleton
          height="100%"
          width="100%"
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </div>

      <div className="flex flex-col items-start justify-start gap-3 sm:gap-4 p-3 sm:p-4 w-full flex-grow">
        <div className="flex flex-col items-start justify-start gap-2 sm:gap-3 w-full">
          <div className="flex flex-col items-start justify-start gap-1 sm:gap-2 w-full">
            {/* Title skeleton */}
            <div className="text-black text-[18px] sm:text-[20px] leading-6 font-semibold">
              <Skeleton
                height={20}
                width="80%"
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            </div>
            {/* Duration skeleton */}
            <div>
              <Skeleton
                height={16}
                width="60%"
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            </div>
            {/* Rating skeleton */}
            <div className="flex items-center gap-[3px] mt-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  height={18}
                  width={18}
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                />
              ))}
            </div>
          </div>
          {/* Course fee skeleton */}
          <div className="text-black text-[13px] sm:text-[14px] font-medium line-clamp-2">
            <Skeleton
              height={14}
              width="70%"
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <div className="p-3 sm:p-4 pt-0 sm:pt-0 w-44 mx-auto">
        <Skeleton
          height={40}
          width="100%"
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </div>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="w-full px-4 py-8 mt-[52px] lg:mt-[50px]">
      {/* Title skeleton */}
      <div className="text-center mb-6">
        <Skeleton
          height={32}
          width={300}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
          className="mx-auto"
        />
      </div>

      <div className="relative w-full">
        <div
          className="flex items-center justify-between w-full"
          style={{ minHeight: "250px" }}
        >
          {/* Previous button skeleton */}
          <Skeleton
            height={40}
            width={40}
            circle
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
            style={{ marginRight: "30px" }}
          />

          <div
            className="overflow-hidden relative z-10 flex-1"
            style={{
              maxWidth: `${8 * (340 + 16)}px`,
            }}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out gap-6"
              style={{
                width: `${8 * (340 + 16)}px`,
              }}
            >
              {[...Array(8)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          </div>

          {/* Next button skeleton */}
          <Skeleton
            height={40}
            width={40}
            circle
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
            style={{ marginLeft: "30px" }}
          />
        </div>
      </div>

      {/* View more button skeleton */}
      <div className="flex justify-center mt-[98px]">
        <Skeleton
          height={48}
          width={306}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </div>
    </div>
  );
};

export default CourseSkeleton;
