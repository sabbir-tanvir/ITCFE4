import { useEffect, useState, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import Button from "./Button";
import _logo from "../../assets/MainLogo/Logo.png"; // Use your actual logo path
import { fetchSiteSettings } from "../../config/siteSettingsApi";
import { Api_Base_Url, Site_Id } from "../../config/api";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); // State for desktop gallery dropdown
  const [buttonColor, setButtonColor] = useState('#FC5D43');
  const [_headerFooterColor, setHeaderFooterColor] = useState('#ffffff'); // Default white
  const [primaryColor, setPrimaryColor] = useState('#FC5D43'); // For top section background
  const [secondaryColor, setSecondaryColor] = useState('#ffffff'); // For main navbar background
  const [isLoading, setIsLoading] = useState(true);

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
          if (settingsData.header_footer_color) setHeaderFooterColor(settingsData.header_footer_color);
          if (settingsData.primary_color) setPrimaryColor(settingsData.primary_color);
          if (settingsData.secondary_color) setSecondaryColor(settingsData.secondary_color);
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

  const navLinkStyle = ({ isActive, isHover }) => {
    return {
      className: isActive
        ? "px-2 py-1 text-white rounded-tl-[30px] rounded-bl-[30px] rounded-br-[30px] inline-flex justify-center items-center gap-2.5"
        : "rounded-[12px] px-2 py-1",
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

  // Determine if any gallery sub-route is active
  const isGalleryActive =
    location.pathname === "/photoGallery" ||
    location.pathname === "/videoGallery";

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
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Top section shimmer */}
        <div className="px-2 sm:px-4 md:px-[40px] lg:px-[82px] py-4" style={{ backgroundColor: '#FC5D43' }}>
          {/* Mobile layout shimmer */}
          <div className="block md:hidden">
            {/* Description shimmer */}
            <div className="text-center mb-2">
              <div className="w-[250px] h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
            {/* Phone/email and social icons shimmer */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="w-7 h-7 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop layout shimmer */}
          <div className="hidden md:grid grid-cols-3 gap-4 items-center">
            {/* Left: Phone/email shimmer */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Center: Description shimmer */}
            <div className="text-center">
              <div className="w-[300px] h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
            
            {/* Right: Social icons shimmer */}
            <div className="flex justify-end gap-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main navbar shimmer */}
        <div 
          className="px-2 sm:px-4 md:px-[40px] lg:px-[82px] min-h-[64px] relative"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="navbar rounded-xl">
            <div className="navbar-start">
              {/* Mobile menu button shimmer */}
              <div className="lg:hidden">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              {/* Logo shimmer */}
              <div className="text-lg md:text-xl flex items-center gap-2">
                <div className="w-[56px] h-[56px] sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="hidden sm:block w-[120px] h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="navbar-center hidden lg:flex">
              {/* Desktop menu items shimmer */}
              <div className="menu menu-horizontal px-1 flex gap-4 xl:gap-8 font-nav">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="w-[60px] h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="navbar-end">
              {/* Contact button shimmer */}
              <div className="w-[80px] h-10 bg-gray-200 rounded animate-pulse"></div>
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
      <div className="">
        {/* Company Information Section */}
        <div className="px-2 sm:px-4 md:px-[40px] lg:px-[82px] py-4" style={{ backgroundColor: primaryColor }}>
          {/* Mobile layout: short description on top, phone/email left, social icons right */}
          <div className="block md:hidden">
            {/* First row: short description centered */}
            <div className="text-center mb-2">
              <div className="text-sm text-white">
                {siteSettings.short_description ? (
                  <span dangerouslySetInnerHTML={{ __html: siteSettings.short_description }} />
                ) : (
                  "সর্ববৃহৎ প্রযুক্তি নির্ভর, কারিগরি ও বৃত্তিমূলক শিক্ষা"
                )}
              </div>
            </div>
            {/* Second row: phone/email left, social icons right */}
            <div className="flex px-4 items-center justify-between gap-2">
              {/* Left: Phone and Email vertically stacked */}
              <div className="flex flex-col gap-1">
                {/* Phone with phone icon */}
                <a href={`tel:${siteSettings.phone || "01886666619"}`} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 24 25" fill="none">
                    <path d="M15.5625 4.5H7.4375C6.09131 4.5 5 5.47683 5 6.68182V18.3182C5 19.5232 6.09131 20.5 7.4375 20.5H15.5625C16.9087 20.5 18 19.5232 18 18.3182V6.68182C18 5.47683 16.9087 4.5 15.5625 4.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.875 17.5898H13.125H9.875Z" fill="#FC5D43"/>
                    <path d="M9.875 17.5898H13.125" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-white text-xs font-medium">
                    {siteSettings.phone || "01886666619"}
                  </div>
                </a>
                
                {/* Email with email icon */}
                {siteSettings.email && (
                  <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 24 25" fill="none">
                      <path d="M2 6.5L8.91302 10.417C11.4616 11.861 12.5384 11.861 15.087 10.417L22 6.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M2.01577 13.9756C2.08114 17.0412 2.11383 18.5739 3.24496 19.7094C4.37608 20.8448 5.95033 20.8843 9.09883 20.9634C11.0393 21.0122 12.9607 21.0122 14.9012 20.9634C18.0497 20.8843 19.6239 20.8448 20.7551 19.7094C21.8862 18.5739 21.9189 17.0412 21.9842 13.9756C22.0053 12.9899 22.0053 12.0101 21.9842 11.0244C21.9189 7.95886 21.8862 6.42609 20.7551 5.29066C19.6239 4.15523 18.0497 4.11568 14.9012 4.03657C12.9607 3.98781 11.0393 3.98781 9.09882 4.03656C5.95033 4.11566 4.37608 4.15521 3.24495 5.29065C2.11382 6.42608 2.08114 7.95885 2.01576 11.0244C1.99474 12.0101 1.99475 12.9899 2.01577 13.9756Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    <div className="text-white text-xs">
                      {siteSettings.email}
                    </div>
                  </a>
                )}
              </div>
              
              {/* Right: Social Icons */}
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
                        className={`w-7 h-7 flex items-center justify-center ${item.color} rounded text-white ${item.hover} transition-colors cursor-pointer`}
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
                    className="w-7 h-7 bg-green-600 text-white rounded flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Desktop layout: phone/email left, description center, social icons right */}
          <div className="hidden md:grid grid-cols-3 gap-4 items-center">
            {/* Left Column: Phone and Email with icons */}
            <div className="flex items-center gap-4">
              {/* Phone with phone icon */}
              <a href={`tel:${siteSettings.phone || "01886666619"}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 24 25" fill="none">
                  <path d="M15.5625 4.5H7.4375C6.09131 4.5 5 5.47683 5 6.68182V18.3182C5 19.5232 6.09131 20.5 7.4375 20.5H15.5625C16.9087 20.5 18 19.5232 18 18.3182V6.68182C18 5.47683 16.9087 4.5 15.5625 4.5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.875 17.5898H13.125H9.875Z" fill="#FC5D43"/>
                  <path d="M9.875 17.5898H13.125" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="text-white text-sm font-semibold">
                  {siteSettings.phone || "01886666619"}
                </div>
              </a>
              
              {/* Email with email icon */}
              {siteSettings.email && (
                <a href={`mailto:${siteSettings.email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 24 25" fill="none">
                    <path d="M2 6.5L8.91302 10.417C11.4616 11.861 12.5384 11.861 15.087 10.417L22 6.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M2.01577 13.9756C2.08114 17.0412 2.11383 18.5739 3.24496 19.7094C4.37608 20.8448 5.95033 20.8843 9.09883 20.9634C11.0393 21.0122 12.9607 21.0122 14.9012 20.9634C18.0497 20.8843 19.6239 20.8448 20.7551 19.7094C21.8862 18.5739 21.9189 17.0412 21.9842 13.9756C22.0053 12.9899 22.0053 12.0101 21.9842 11.0244C21.9189 7.95886 21.8862 6.42609 20.7551 5.29066C19.6239 4.15523 18.0497 4.11568 14.9012 4.03657C12.9607 3.98781 11.0393 3.98781 9.09882 4.03656C5.95033 4.11566 4.37608 4.15521 3.24495 5.29065C2.11382 6.42608 2.08114 7.95885 2.01576 11.0244C1.99474 12.0101 1.99475 12.9899 2.01577 13.9756Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-white text-sm">
                    {siteSettings.email}
                  </div>
                </a>
              )}
            </div>
            
            {/* Center Column: Short Description */}
            <div className="text-center">
              <div className="text-sm sm:text-base text-white">
                {siteSettings.short_description ? (
                  <span dangerouslySetInnerHTML={{ __html: siteSettings.short_description }} />
                ) : (
                  "আইটি ট্রেনিং ও সফটওয়ার ১০ বছর অভিজ্ঞতায় ও অনলাইনে ট্রেনিং চলাকে"
                )}
              </div>
            </div>
            
            {/* Right Column: Social Media Icons */}
            <div className="flex justify-end gap-2">
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
        <div 
          className="px-2 sm:px-4 md:px-[40px] lg:px-[82px] min-h-[64px] relative"
          style={{ backgroundColor: secondaryColor }}
        >
          <div className="navbar rounded-xl">
            <div className="navbar-start">
              <div className="lg:hidden">
                <button
                  type="button"
                  ref={hamburgerRef}
                  className="btn btn-ghost text-black"
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
                  <ul ref={dropdownRef} className="absolute left-4 mt-2 bg-base-100 rounded-box z-50 w-52 p-4 shadow grid gap-4 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
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
                        className={`flex items-center gap-1 w-full px-2 py-1 text-left rounded-[12px] ${isGalleryActive ? "text-white" : "hover:text-black"}`}
                        style={isGalleryActive ? { backgroundColor: buttonColor } : {}}
                        onClick={handleGalleryClick}
                      >
                        গ্যালারী
                        <RiArrowDropDownLine />
                      </button>
                      {isGalleryOpen && (
                        <ul className="absolute left-0 top-full mt-1 w-auto bg-white rounded-box shadow z-50 p-2">
                          <li>
                            <NavLink
                              {...navLinkStyle2({ isActive: location.pathname === "/photoGallery" })}
                              to="/photoGallery"
                              onClick={handleMenuItemClick}
                            >
                              ফটো গ্যালারী
                            </NavLink>
                          </li>
                          <li className="mt-1">
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
              <NavLink to="/" className="btn btn-ghost text-lg md:text-xl flex items-center gap-2 px-0 text-black">
                <img
                  src={siteSettings.logo || ""}
                  alt="Amader Shikkha Logo"
                  className="w-[56px] h-[56px] p-0 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 object-contain"
                />
                <span className="hidden sm:inline">{siteSettings.name || "Amader Shikkha"}</span>
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
                <NavLink to="/blog" {...navLinkStyle({ isActive: location.pathname === "/blog" })}>
                  ব্লগ
                </NavLink>

                <div className="dropdown dropdown-hover" ref={galleryButtonRef}>
                  <label
                    tabIndex={0}
                    className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded-[12px] transition-colors duration-200 ${
                      isGalleryActive 
                        ? "text-white" 
                        : "text-black hover:text-black"
                    }`}
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

