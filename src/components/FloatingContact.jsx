import React, { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaHeadset, FaWhatsapp, FaPhone } from "react-icons/fa";
import { fetchSiteSettings } from "../config/siteSettingsApi";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const contactRef = useRef(null);
  const [primaryColor, setPrimaryColor] = useState('#FFFF');
  const [contactInfo, setContactInfo] = useState({
    phone: null,
    email: null,
    whatsApp: null
  });

  const toggleContact = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Fetch site settings directly (no caching)
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data) {
          if (data.primary_color) setPrimaryColor(data.primary_color);
          setContactInfo({
            phone: data.phone || null,
            email: data.email || null,
            whatsApp: data.whatsApp || null
          });
        }
      })
      .catch(() => { });
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactRef.current && !contactRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={contactRef}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[9999] pointer-events-none"
    >
      <div className="relative pointer-events-auto">
        {/* Main contact icon */}
        <div
          onClick={toggleContact}
          style={{ backgroundColor: primaryColor }}
          className=" text-white p-3 rounded-full shadow-lg cursor-pointer transition-all duration-300"
        >
          <FaHeadset size={24} />
        </div>

        {/* Contact icons */}
        <div
          className={`absolute right-14 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 transition-all duration-300 ${isOpen
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4 pointer-events-none"
            }`}
        >
          {/* WhatsApp */}
          {contactInfo.whatsApp && (
            <a
              href={`https://wa.me/${contactInfo.whatsApp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
              title="WhatsApp"
            >
              <FaWhatsapp size={24} />
            </a>
          )}

          {/* Phone */}
          {contactInfo.phone && (
            <a
              href={`tel:${contactInfo.phone}`}
              className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
              title="Phone"
            >
              <FaPhone size={24} />
            </a>
          )}

          {/* Email */}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300"
              title="Email"
            >
              <FaEnvelope size={24} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingContact;
