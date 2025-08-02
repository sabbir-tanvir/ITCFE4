import Skeleton from "react-loading-skeleton";

const NavbarSkeleton = () => {
  return (
    <div>
      <div className="bg-sky-100 sticky top-0 z-50 shadow-md">
        <div className="mx-0 md:mx-6 lg:mx-[80px] p-4 md:p-6">
          <div className="navbar bg-white rounded-xl">
            <div className="navbar-start">
              {/* Mobile menu button skeleton */}
              <div className="lg:hidden">
                <Skeleton
                  height={40}
                  width={40}
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                />
              </div>
              {/* Logo skeleton */}
              <div className="text-lg md:text-xl flex items-center gap-2">
                <Skeleton
                  height={56}
                  width={56}
                  circle
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                />
                <Skeleton
                  height={20}
                  width={120}
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                  className="hidden sm:block"
                />
              </div>
            </div>
            <div className="navbar-center hidden lg:flex">
              {/* Desktop menu items skeleton */}
              <div className="menu menu-horizontal px-1 flex gap-4 xl:gap-8 font-nav">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Skeleton
                    key={index}
                    height={32}
                    width={60}
                    baseColor="#e5e7eb"
                    highlightColor="#f3f4f6"
                  />
                ))}
              </div>
            </div>
            <div className="navbar-end">
              {/* Contact button skeleton */}
              <Skeleton
                height={40}
                width={100}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarSkeleton;
