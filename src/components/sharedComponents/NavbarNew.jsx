import { useEffect, useState, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import Button from "./Button";
import logo from "../../assets/MainLogo/Logo.png"; // Use your actual logo path
import { fetchSiteSettings } from "../../config/siteSettingsApi";
import { Api_Base_Url, Site_Id } from "../../config/api";
import { ShimmerButton, ShimmerCircularImage, ShimmerText } from "react-shimmer-effects";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); // State for desktop gallery dropdown
  const [headerColor, setHeaderColor] = useState('#FFFF');
  const [buttonColor, setButtonColor] = useState('#FC5D43');
  const [isLoading, setIsLoading] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Create refs for the dropdown elements
  const dropdownRef = useRef(null); // Used for mobile dropdown and potentially desktop gallery area
  const hamburgerRef = useRef(null);
  const galleryButtonRef = useRef(null); // Ref for the desktop gallery button
  const navbarRef = useRef(null); // Ref for the navbar to measure its height

  const location = useLocation(); // Get current location

  // Site settings state (for company info, logo, etc.)
  const [siteSettings, setSiteSettings] = useState({});
  const [socialLinks, setSocialLinks] = useState([]);

  // --- EFFECTS ---

  // Effect to measure navbar height and set CSS custom property
  useEffect(() => {
    const measureNavbarHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        setNavbarHeight(height);
        // Set CSS custom property for global use
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };

    // Measure on mount and when window resizes
    measureNavbarHeight();
    window.addEventListener('resize', measureNavbarHeight);

    return () => {
      window.removeEventListener('resize', measureNavbarHeight);
    };
  }, [isLoading, siteSettings]); // Re-measure when loading completes or settings change

  // Effect to reset isGalleryOpen when the route changes (fixes the main issue)
  useEffect(() => {
    setIsGalleryOpen(false);
  }, [location.pathname]); // Dependency on pathname

  // Click outside handler - Updated for desktop gallery
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideMainDropdown =
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target);

      const isOutsideHamburger =
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target);

      // Close mobile dropdown if open and clicked outside
      if (isDropdownOpen && isOutsideMainDropdown && isOutsideHamburger) {
        setIsDropdownOpen(false);
      }

      // Close desktop gallery dropdown if open and clicked outside
      // Checks if click is outside the dropdown list or the gallery button itself
      if (isGalleryOpen && isOutsideMainDropdown) {
        // Additional check to ensure click wasn't on the gallery button
        const isClickOnGalleryButton =
          galleryButtonRef.current &&
          galleryButtonRef.current.contains(event.target);

        if (!isClickOnGalleryButton) {
           setIsGalleryOpen(false);
        }
      }
    };

    // Add event listener if mobile menu OR desktop gallery dropdown is open
    if (isDropdownOpen || isGalleryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isGalleryOpen]); // Dependencies on both states

  // Function to fetch social links
  const fetchSocialLinks = async () => {
    try {
      const response = await fetch(`${Api_Base_Url}/social-links`, {
        headers: {
          "Site-Id": Site_Id,
        },
      });
      const data = await response.json();
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error) {
      console.log("Error fetching social links:", error);
      return [];
    }
  };

  // Fetch all navbar data with loading state
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchSiteSettings(),
      fetchSocialLinks()
    ])
      .then(([settingsData, socialData]) => {
        // Handle settings data
        if (settingsData) {
          setSiteSettings(settingsData);
          if (settingsData.button_color) setButtonColor(settingsData.button_color);
          if (settingsData.header_footer_color) setHeaderColor(settingsData.header_footer_color);
        }
        // Handle social links data
        setSocialLinks(Array.isArray(socialData) ? socialData : []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // --- UTILITY FUNCTIONS ---

  // Utility to get a light/low-opacity version of buttonColor
  function getLightButtonColor(color, opacity = 0.15) {
    if (!color.startsWith('#') || (color.length !== 7 && color.length !== 9)) return color;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  }

  // --- STYLE FUNCTIONS ---

  // New navLinkStyle for shimmer version and desktop top-level items
  const navLinkStyle = ({ isActive, isHover }) => {
    return {
      className: isActive
        ? "px-4 py-2 text-white bg-red-500 rounded text-lg font-medium"
        : "text-black hover:bg-red-500 hover:text-white rounded px-4 py-2 text-lg font-medium transition-colors",
      style: isActive
        ? { backgroundColor: buttonColor, color: '#fff' }
        : isHover
          ? { backgroundColor: getLightButtonColor(buttonColor), color: '#111' }
          : { color: '#111' },
    };
  };

  // Style for mobile menu items and desktop dropdown items
  const navLinkStyle2 = ({ isActive, isHover }) => {
    return {
      className: isActive
        ? "text-white bg-red-500 rounded-[12px] px-2 py-1"
        : "text-black hover:bg-red-500 hover:text-white rounded-[12px] px-2 py-1 ",
      style: isActive
        ? { backgroundColor: buttonColor, color: '#fff' }
        : isHover
          ? { backgroundColor: getLightButtonColor(buttonColor), color: '#111' }
          : { color: '#111' },
    };
  };

  // --- LOADING STATE ---

  // Show shimmer while loading site settings
  if (isLoading) {
    return (
      <div
        ref={navbarRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: '100%',
          background: 'linear-gradient(to right, #f3f4f6, #e5e7eb)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div className="py-[6px] px-0 sm:px-4 md:px-[82px]">
          <div className="navbar rounded-xl min-h-[60px]">
            <div className="navbar-start">
              {/* Mobile menu button shimmer */}
              <div className="lg:hidden">
                <div className="w-[32px] h-[32px]">
                  <ShimmerButton size="sm" />
                </div>
              </div>
              {/* Logo shimmer */}
              <div className="text-lg md:text-xl flex items-center gap-2">
                <span className="block sm:hidden"><ShimmerCircularImage size={20} /></span>
                <span className="hidden sm:block"><ShimmerCircularImage size={30} /></span>
                <div className="hidden sm:block w-[100px] h-[16px]">
                  <ShimmerText line={1} gap={5} />
                </div>
              </div>
            </div>
            <div className="navbar-center hidden lg:flex">
              {/* Desktop menu items shimmer */}
              <div className="menu menu-horizontal px-1 flex gap-4 xl:gap-8 font-nav">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="w-[50px] h-[14px]">
                    <ShimmerText line={1} gap={5} />
                  </div>
                ))}
              </div>
            </div>
            <div className="navbar-end">
              {/* Contact button shimmer */}
              <div className="w-[80px] h-[32px]">
                <ShimmerButton size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- EVENT HANDLERS ---

  // Social media items configuration with icons and styling
  const socialMediaItems = [
    {
      name: "facebook",
      icon: <FaFacebookF size={14} />, color: "bg-blue-600", hover: "hover:bg-blue-700"
    },
    {
      name: "twitter",
      icon: <FaTwitter size={14} />, color: "bg-sky-500", hover: "hover:bg-sky-600"
    },
    {
      name: "linkedin",
      icon: <FaLinkedinIn size={14} />, color: "bg-blue-700", hover: "hover:bg-blue-800"
    },
    {
      name: "youtube",
      icon: <FaYoutube size={14} />, color: "bg-red-600", hover: "hover:bg-red-700"
    },
    {
      name: "instagram",
      icon: <FaInstagram size={14} />, color: "bg-pink-600", hover: "hover:bg-pink-700"
    }
  ];

  const handleHamburgerClick = () => {
    setIsDropdownOpen((prev) => !prev);
    // Ensure desktop gallery dropdown is closed when mobile menu opens
    setIsGalleryOpen(false);
  };

  // Close both mobile and desktop dropdowns when a menu item is clicked
  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
    setIsGalleryOpen(false);
  };

  // Toggle the desktop gallery dropdown
  const handleGalleryClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsGalleryOpen((prev) => !prev);
  };

  // Determine if any gallery sub-route is active
  const isGalleryActive =
    location.pathname === "/photoGallery" ||
    location.pathname === "/videoGallery";

  // --- RENDER ---
  return (
    <div
      ref={navbarRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="pt-[2px]">
        {/* Company Information Section */}
        <div className="bg-white py-1 px-2 sm:px-4 md:px-[40px] lg:px-[82px] border-b">
          {/* Mobile layout: phone & tagline top, then logo/name/location left, social icons right */}
          <div className="block md:hidden">
            {/* First row: phone and tagline */}
            <div className="flex flex-col items-center justify-center mb-2">
              <div className="text-base font-semibold text-gray-800">
                {siteSettings.phone || "01886666619"}
              </div>
              <div className="text-sm text-black text-center">
                {siteSettings.short_description ? (
                  <span dangerouslySetInnerHTML={{ __html: siteSettings.short_description }} />
                ) : (
                  "সর্ববৃহৎ প্রযুক্তি নির্ভর, কারিগরি ও বৃত্তিমূলক শিক্ষা"
                )}
              </div>
            </div>
            {/* Second row: logo/name/location left, social icons right */}
            <div className="flex items-center justify-between gap-2">
              <NavLink to="/" className="flex items-center gap-2 cursor-pointer">
                <img
                  src={siteSettings.logo || logo}
                  alt={siteSettings.name || "Amader Shikkha Logo"}
                  className="w-14 h-14 object-contain" // Increased size for mobile
                />
                <div>
                  <div className="text-blue-600 font-bold text-base">{siteSettings.name || "Amader Shikkha"}</div>
                  <div className="text-xs text-gray-600">{siteSettings.address || "Bashundhara, Dhaka"}</div>
                </div>
              </NavLink>
              <div className="flex gap-1">
                {socialMediaItems
                  .filter((item) => {
                    const link = socialLinks.find((l) => l.name === item.name);
                    return link && link.url && link.url.trim() !== "";
                  })
                  .map((item) => {
                    const link = socialLinks.find((l) => l.name === item.name);
                    return (
                      <a
                        key={item.name}
                        href={link.url}
                        title={item.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-8 h-8 flex items-center justify-center ${item.color} rounded text-white ${item.hover} transition-colors cursor-pointer`}
                      >
                        {item.icon}
                      </a>
                    );
                  })}
                {/* Always show WhatsApp from site settings */}
                {siteSettings.phone && (
                  <a
                    href={`https://wa.me/${siteSettings.phone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
          {/* Desktop layout: unchanged */}
          <div className="hidden md:grid grid-cols-3 gap-4 items-center">
            {/* Left Column: Logo, Brand Name, Address */}
            <NavLink to="/" className="flex items-center justify-center lg:justify-start gap-3 cursor-pointer">
              <img
                src={siteSettings.logo || logo}
                alt={siteSettings.name || "Amader Shikkha Logo"}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
              <div>
                <div className="text-blue-600 font-bold text-base sm:text-lg">{siteSettings.name || "Amader Shikkha"}</div>
                <div className="text-xs sm:text-sm text-gray-600">{siteSettings.address || "Bashundhara, Dhaka"}</div>
              </div>
            </NavLink>
            {/* Center Column: Phone Numbers and Description */}
            <div className="text-center">
              <div className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                {siteSettings.phone || "01886666619"}
              </div>
              <div className="text-sm sm:text-base text-black">
                {siteSettings.short_description ? (
                  <span dangerouslySetInnerHTML={{ __html: siteSettings.short_description }} />
                ) : (
                  "আইটি ট্রেনিং ও সফটওয়ার ১০ বছর অভিজ্ঞতায় ও অনলাইনে ট্রেনিং চলাকে"
                )}
              </div>
            </div>
            {/* Right Column: Social Media Icons - Dynamic from API */}
            <div className="flex justify-center md:justify-end gap-1 sm:gap-2">
              {socialMediaItems
                .filter((item) => {
                  const link = socialLinks.find((l) => l.name === item.name);
                  return link && link.url && link.url.trim() !== "";
                })
                .map((item) => {
                  const link = socialLinks.find((l) => l.name === item.name);
                  return (
                    <a
                      key={item.name}
                      href={link.url}
                      title={item.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 flex items-center justify-center ${item.color} rounded text-white ${item.hover} transition-colors cursor-pointer`}
                    >
                      {item.icon}
                    </a>
                  );
                })}

              {/* Always show WhatsApp from site settings */}
              {siteSettings.phone && (
                <a
                  href={`https://wa.me/${siteSettings.phone.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <FaWhatsapp size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar Area */}
        <div className="px-2 sm:px-4 md:px-[40px] lg:px-[82px] min-h-[64px] relative"
          style={{
            background: `linear-gradient(90deg, ${headerColor} 20%, ${headerColor}B3 30%, ${headerColor}1A 100%)`,
          }}
        >
          {/* MOBILE ONLY: Hamburger Menu */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between py-4 ">
              <button
                ref={hamburgerRef}
                type="button"
                className="text-white p-2 "
                onClick={handleHamburgerClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              <NavLink to="/contact">
                <Button className="rounded-[12px] text-sm px-4 py-2 "
                  style={{ backgroundColor: buttonColor }}
                >
                  যোগাযোগ
                </Button>
              </NavLink>
            </div>
          </div>

          {/* MOBILE DROPDOWN */}
          {isDropdownOpen && (
            <ul ref={dropdownRef} className="lg:hidden absolute left-4 top-full mt-2 bg-white rounded-xl z-50 p-3 shadow-lg border border-gray-200 w-48 min-w-max">
              <li className="py-1">
                <NavLink to="/" className={navLinkStyle2({ isActive: location.pathname === "/" }).className} style={navLinkStyle2({ isActive: location.pathname === "/" }).style} onClick={handleMenuItemClick}>
                  হোম
                </NavLink>
              </li>
              <li className="py-1">
                <NavLink to="/course" className={navLinkStyle2({ isActive: location.pathname === "/course" }).className} style={navLinkStyle2({ isActive: location.pathname === "/course" }).style} onClick={handleMenuItemClick}>
                  কোর্স
                </NavLink>
              </li>
              <li className="py-1">
                <NavLink to="/training" className={navLinkStyle2({ isActive: location.pathname === "/training" }).className} style={navLinkStyle2({ isActive: location.pathname === "/training" }).style} onClick={handleMenuItemClick}>
                  প্রশিক্ষক
                </NavLink>
              </li>
              <li className="py-1">
                <NavLink to="/games" className={navLinkStyle2({ isActive: location.pathname === "/games" }).className} style={navLinkStyle2({ isActive: location.pathname === "/games" }).style} onClick={handleMenuItemClick}>
                  গেমস
                </NavLink>
              </li>
              <li className="py-1 relative">
                <button
                  type="button"
                  className={`flex items-center gap-1 w-full px-2 py-1 text-left rounded-[12px] ${isGalleryActive
                    ? "text-white bg-red-500"
                    : "hover:bg-red-500 hover:text-white"
                    }`}
                  style={isGalleryActive ? { backgroundColor: buttonColor } : {}}
                  onClick={handleGalleryClick}
                >
                  গ্যালারী
                  <RiArrowDropDownLine />
                </button>
                {isGalleryOpen && ( // Use isGalleryOpen for mobile dropdown as well
                  <ul className="absolute left-0  mt-4 w-auto bg-white rounded-box shadow z-50 p-4">
                    <li>
                      <NavLink
                        className={navLinkStyle2({ isActive: location.pathname === "/photoGallery" }).className}
                        style={navLinkStyle2({ isActive: location.pathname === "/photoGallery" }).style}
                        to="/photoGallery"
                        onClick={handleMenuItemClick}
                      >
                        ফটো গ্যালারী
                      </NavLink>
                    </li>
                    <li className="mt-2">
                      <NavLink
                        className={navLinkStyle2({ isActive: location.pathname === "/videoGallery" }).className}
                        style={navLinkStyle2({ isActive: location.pathname === "/videoGallery" }).style}
                        to="/videoGallery"
                        onClick={handleMenuItemClick}
                      >
                        ভিডিও গ্যালারী
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className="py-1">
                <NavLink to="/blog" className={navLinkStyle2({ isActive: location.pathname === "/blog" }).className} style={navLinkStyle2({ isActive: location.pathname === "/blog" }).style} onClick={handleMenuItemClick}>
                  ব্লগ
                </NavLink>
              </li>
            </ul>
          )}

          {/* DESKTOP ONLY: Full Menu */}
          <div className="hidden lg:flex items-center justify-between py-4 ">
            {/* LEFT: Menu Items */}
            <ul className="flex gap-6 items-center">
              <li>
                <NavLink to="/" className={navLinkStyle({ isActive: location.pathname === "/" }).className} style={navLinkStyle({ isActive: location.pathname === "/" }).style}>
                  হোম
                </NavLink>
              </li>
              <li>
                <NavLink to="/course" className={navLinkStyle({ isActive: location.pathname === "/course" }).className} style={navLinkStyle({ isActive: location.pathname === "/course" }).style}>
                  কোর্স
                </NavLink>
              </li>
              <li>
                <NavLink to="/training" className={navLinkStyle({ isActive: location.pathname === "/training" }).className} style={navLinkStyle({ isActive: location.pathname === "/training" }).style}>
                  প্রশিক্ষক
                </NavLink>
              </li>
              <li>
                <NavLink to="/games" className={navLinkStyle({ isActive: location.pathname === "/games" }).className} style={navLinkStyle({ isActive: location.pathname === "/games" }).style}>
                  গেমস
                </NavLink>
              </li>

              {/* Desktop Gallery Item - Modified for State Control */}
              <li className="relative" ref={dropdownRef}>
                <button
                  ref={galleryButtonRef}
                  type="button"
                  className={`flex items-center gap-1 px-4 py-2 rounded transition-colors duration-200 text-lg font-medium ${isGalleryActive || isGalleryOpen ? "text-white" : "text-black hover:bg-red-500 hover:text-white"}`}
                  style={isGalleryActive || isGalleryOpen ? { backgroundColor: buttonColor } : {}}
                  onClick={handleGalleryClick} // Toggle on click
                >
                  গ্যালারী
                  <RiArrowDropDownLine className={`${isGalleryOpen ? 'rotate-180' : ''} transition-transform`} />
                </button>

                {/* Submenu - Controlled by isGalleryOpen state, not hover */}
                {isGalleryOpen && (
                  <ul className="absolute left-0 top-full mt-2 min-w-max bg-white rounded-box shadow z-50 p-2 gap-1 whitespace-nowrap">
                    <li>
                      <NavLink
                        className={navLinkStyle2({ isActive: location.pathname === "/photoGallery" }).className}
                        style={navLinkStyle2({ isActive: location.pathname === "/photoGallery" }).style}
                        to="/photoGallery"
                        onClick={handleMenuItemClick} // Close dropdown on item click
                      >
                        ফটো গ্যালারী
                      </NavLink>
                    </li>
                    <li className="mt-2">
                      <NavLink
                        className={navLinkStyle2({ isActive: location.pathname === "/videoGallery" }).className}
                        style={navLinkStyle2({ isActive: location.pathname === "/videoGallery" }).style}
                        to="/videoGallery"
                        onClick={handleMenuItemClick} // Close dropdown on item click
                      >
                        ভিডিও গ্যালারী
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <NavLink className={navLinkStyle({ isActive: location.pathname === "/blog" }).className} style={navLinkStyle({ isActive: location.pathname === "/blog" }).style} to="/blog">
                  ব্লগ
                </NavLink>
              </li>
            </ul>

            {/* RIGHT: Contact Button */}
            <NavLink to="/contact">
              <Button className="rounded-[12px] text-base px-4 py-2"
                style={{ backgroundColor: buttonColor }}
              >
                যোগাযোগ
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;