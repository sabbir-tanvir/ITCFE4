import { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import logo from "../../assets/MainLogo/Logo.png"; // Use your actual logo path
import { useLocation } from "react-router-dom";
import { fetchSiteSettings } from "../../config/siteSettingsApi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [headerColor, setHeaderColor] = useState('#FFFF');
  const [buttonColor, setButtonColor] = useState('#FC5D43');

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
        if (data && data.header_footer_color) {
          setHeaderColor(data.header_footer_color);
        }
      })
      .catch(() => { });
  }, []);


  // Utility to get a light/low-opacity version of buttonColor
  function getLightButtonColor(color, opacity = 0.15) {
    // Accepts hex like #FC5D43 or #FC5D43CC
    if (!color.startsWith('#') || (color.length !== 7 && color.length !== 9)) return color;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  }

  const navLinkStyle = ({ isActive, isHover }) => {
    return {
      className: isActive
        ? "px-2 py-1 text-white rounded-tl-[30px] rounded-bl-[30px] rounded-br-[30px] inline-flex justify-center items-center gap-2.5"
        : "text-black rounded-[12px] px-2 py-1",
      style: isActive
        ? { backgroundColor: buttonColor, color: '#fff' }
        : isHover
          ? { backgroundColor: getLightButtonColor(buttonColor), color: '#111' }
          : { color: '#111' },
    };
  };
  const navLinkStyle2 = ({ isActive, isHover }) => {
    return {
      className: isActive
        ? "text-white rounded-[12px] px-2 py-1"
        : "text-black rounded-[12px] px-2 py-1",
      style: isActive
        ? { backgroundColor: buttonColor, color: '#fff' }
        : isHover
          ? { backgroundColor: getLightButtonColor(buttonColor), color: '#111' }
          : { color: '#111' },
    };
  };

  const handleHamburgerClick = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsGalleryOpen(false);
  };

  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
    setIsGalleryOpen(false);
  };

  const handleGalleryClick = (e) => {
    e.stopPropagation();
    setIsGalleryOpen((prev) => !prev);
  };

  const location = useLocation();

  // Determine if any gallery sub-route is active
  const isGalleryActive =
    location.pathname === "/photoGallery" ||
    location.pathname === "/videoGallery";

  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${headerColor} 20%, ${headerColor}B3 30%, ${headerColor}1A 100%)`,
      }}
    >
      <div>
        <div className="py-[10px] xl:py-[2px] px-4 md:px-[82px]">
          <div className="navbar rounded-xl">
            <div className="navbar-start">
              <div className="lg:hidden">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleHamburgerClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <ul className="absolute left-4 mt-2 bg-base-100 rounded-box z-50 w-52 p-4 shadow grid gap-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <li>
                      <NavLink to="/" {...navLinkStyle({ isActive: location.pathname === "/" })} onClick={handleMenuItemClick}>
                        হোম
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/course" {...navLinkStyle({ isActive: location.pathname === "/course" })} onClick={handleMenuItemClick}>
                        কোর্স
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/training" {...navLinkStyle({ isActive: location.pathname === "/training" })} onClick={handleMenuItemClick}>
                        প্রশিক্ষক
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/games" {...navLinkStyle({ isActive: location.pathname === "/games" })} onClick={handleMenuItemClick}>
                        গেমস
                      </NavLink>
                    </li>
                    <li className="relative">
                      <button
                        type="button"
                        className={`flex items-center gap-1 w-full px-2 py-1 text-left rounded-[12px] ${isGalleryActive ? "text-white" : "hover:text-white"}`}
                        style={isGalleryActive ? { backgroundColor: buttonColor } : {}}
                        onClick={handleGalleryClick}
                      >
                        গ্যালারী
                        <RiArrowDropDownLine />
                      </button>
                      {isGalleryOpen && (
                        <ul className="absolute left-0 top-full mt-1 w-40 bg-white rounded-box shadow z-50 p-2">
                          <li>
                            <NavLink
                              {...navLinkStyle2({ isActive: location.pathname === "/photoGallery" })}
                              to="/photoGallery"
                              onClick={handleMenuItemClick}
                            >
                              ফটো গ্যালারী
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              {...navLinkStyle2({ isActive: location.pathname === "/videoGallery" })}
                              to="/videoGallery"
                              onClick={handleMenuItemClick}
                            >
                              ভিডিও গ্যালারী
                            </NavLink>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <NavLink to="/blog" {...navLinkStyle({ isActive: location.pathname === "/blog" })} onClick={handleMenuItemClick}>
                        ব্লগ
                      </NavLink>
                    </li>
                   
                  </ul>
                )}
              </div>
              <NavLink to="/" className="btn btn-ghost text-lg md:text-xl flex items-center gap-2">
                <img
                  src={logo}
                  alt="Amader Shikkha Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
                />
                <span className="hidden sm:inline">Amader Shikkha</span>
              </NavLink>
            </div>

            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1 flex gap-4 xl:gap-8 font-nav">
                <NavLink to="/" {...navLinkStyle({ isActive: location.pathname === "/" })}>
                  হোম
                </NavLink>
                <NavLink to="/course" {...navLinkStyle({ isActive: location.pathname === "/course" })}>
                  কোর্স
                </NavLink>
                <NavLink to="/training" {...navLinkStyle({ isActive: location.pathname === "/training" })}>
                  প্রশিক্ষক
                </NavLink>
                <NavLink to="/games" {...navLinkStyle({ isActive: location.pathname === "/games" })}>
                  গেমস
                </NavLink>
                {/* Blog and Contact links only in one place (desktop) */}
                <NavLink to="/blog" {...navLinkStyle({ isActive: location.pathname === "/blog" })}>
                  ব্লগ
                </NavLink>


                <div className="dropdown dropdown-hover">
                  <label
                    tabIndex={0}
                    className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded-[12px] transition-colors duration-200 ${isGalleryActive ? "text-white" : "hover:text-black"}`}
                    style={isGalleryActive ? { backgroundColor: buttonColor } : {}}
                  >
                    গ্যালারী
                    <RiArrowDropDownLine />
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content text-black rounded-box shadow mt-3 z-[1] w-36 bg-white p-2"
                  >
                    <li>
                      <NavLink {...navLinkStyle2({ isActive: location.pathname === "/photoGallery" })} to="/photoGallery">
                        ফটো গ্যালারী
                      </NavLink>
                    </li>
                    <li>
                      <NavLink {...navLinkStyle2({ isActive: location.pathname === "/videoGallery" })} to="/videoGallery">
                        ভিডিও গ্যালারী
                      </NavLink>
                    </li>
                  </ul>
                </div>


              </ul>
            </div>

            <div className="navbar-end">

              <NavLink to="/contact" >

                <Button className="rounded-[12px] text-sm md:text-base"
                  style={{ backgroundColor: buttonColor }}
                >
                  যোগাযোগ
                </Button>
                      </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
