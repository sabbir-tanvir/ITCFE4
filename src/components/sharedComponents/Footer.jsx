import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/MainLogo/Logo.png";
import {
  fetchSiteSettings,
  fetchSocialLinks,
} from "../../config/siteSettingsApi";
import { ShimmerText, ShimmerCircularImage } from "react-shimmer-effects";


const mainGridClass =
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12";
const sectionTitleClass = "justify-start text-white text-base font-semibold  ";
const sectionItemClass = "justify-start text-white text-base font-normal  ";
const contactTitleClass =
  "self-stretch justify-start text-white text-lg font-semibold   leading-relaxed";
const contactItemClass =
  "self-stretch justify-start text-white text-lg font-medium   leading-relaxed";
const followTitleClass =
  "justify-start text-white text-lg font-bold   leading-relaxed";
const hrClass = "w-full h-px bg-gray-400";
const footerTextClass = "text-white text-base md:text-lg font-normal";

export default function Footer() {
  const [footerColor, setFooterColor] = useState('#FC5D43');
  const [settings, setSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all footer data with loading state
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchSiteSettings(),
      fetchSocialLinks()
    ])
      .then(([settingsData, socialData]) => {
        // Handle settings data
        if (settingsData && settingsData.header_footer_color) {
          setFooterColor(settingsData.header_footer_color);
        }
        setSettings(Array.isArray(settingsData.results) ? settingsData.results[0] : settingsData);

        // Handle social links data
        setSocialLinks(Array.isArray(socialData) ? socialData : []);

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Show shimmer while loading footer data
  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-20 pt-10 pb-6 bg-gray-800 rounded-tl-3xl rounded-tr-3xl flex flex-col gap-6">
        <div className={mainGridClass}>
          {/* Logo & Description shimmer */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex justify-start items-center gap-2">
              {/* Logo shimmer */}
              <ShimmerCircularImage size={48} />
              {/* Company name shimmer */}
              <div className="w-[150px]">
                <ShimmerText line={1} gap={10} />
              </div>
            </div>
            {/* Description shimmer */}
            <div className="space-y-2">
              <ShimmerText line={3} gap={10} />
            </div>
          </div>

          {/* Navigation Links shimmer */}
          <div className="flex flex-col gap-3">
            {/* Section title shimmer */}
            <div className="w-[100px]">
              <ShimmerText line={1} gap={10} />
            </div>
            {/* Links shimmer */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="w-[80px]">
                <ShimmerText line={1} gap={10} />
              </div>
            ))}
          </div>

          {/* Important Links shimmer */}
          <div className="flex flex-col gap-3">
            {/* Section title shimmer */}
            <div className="w-[120px]">
              <ShimmerText line={1} gap={10} />
            </div>
            {/* Links shimmer */}
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="w-[180px]">
                <ShimmerText line={1} gap={10} />
              </div>
            ))}
          </div>

          {/* Contact Info & Follow shimmer */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              {/* Contact title shimmer */}
              <div className="w-[80px]">
                <ShimmerText line={1} gap={10} />
              </div>
              {/* Contact info shimmer */}
              {[1, 2, 3].map((index) => (
                <div key={index} className="w-[90%]">
                  <ShimmerText line={1} gap={10} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {/* Follow title shimmer */}
              <div className="w-[100px]">
                <ShimmerText line={1} gap={10} />
              </div>
              {/* Social icons shimmer */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <ShimmerCircularImage key={index} size={32} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Divider */}
          <div className="w-full h-px bg-gray-600"></div>
          <div className="grid grid-cols-1 gap-2 text-center">
            {/* Footer text shimmer */}
            <div className="mx-auto w-[300px]">
              <ShimmerText line={1} gap={10} />
            </div>
            <div className="mx-auto w-[250px]">
              <ShimmerText line={1} gap={10} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-20 pt-10 pb-6 bg-header-footer rounded-tl-3xl rounded-tr-3xl flex flex-col gap-6" style={{ backgroundColor: footerColor }}>
      <div className={mainGridClass}>
        {/* Logo & Description */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex justify-start items-center gap-2">
            <img
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
              src={settings?.logo || logo}
              alt={settings?.name || "Amader Shikkha Logo"}
            />
            <div className="justify-start text-white text-lg sm:text-xl font-semibold font-['Poppins']">
              {settings?.name || "Amader Shikkha"}
            </div>
          </div>
          <div className="justify-start text-white text-base sm:text-lg font-normal  ">
            {settings?.short_description ? (
              <span
                dangerouslySetInnerHTML={{ __html: settings.short_description }}
              />
            ) : (
              "সর্ববৃহৎ প্রযুক্তি নির্ভর, কারিগরি ও বৃত্তিমূলক শিক্ষা"
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
          <div className="flex flex-col gap-3">
            <div className="justify-start text-white text-base font-semibold">
              আমাদের কথা
            </div>
            <div className={sectionItemClass}>
              <Link to="/course" className="hover:underline">
                কোর্স
              </Link>
            </div>
            <div className={sectionItemClass}>
              <Link to="/blog" className="hover:underline">
                নিউজ
              </Link>
            </div>
            <div className={sectionItemClass}>
              {" "}
              <Link to="/admission" className="hover:underline">
                এডমিশন
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className={sectionTitleClass}>গুরত্বপূর্ণ লিংক</div>
          <div className={sectionItemClass}>
            <Link
              to="http://www.educationboardresults.gov.bd/"
              target="_blank"
              className="hover:underline"
            >
              শিক্ষা বোর্ডের ফলাফল
            </Link>
          </div>
          <div className={sectionItemClass}>
            <Link
              to="https://services.nidw.gov.bd/nid-pub/"
              target="_blank"
              className="hover:underline"
            >
              এনআইডি আবেদন সিস্টেম
            </Link>
          </div>
          <div className={sectionItemClass}>
            <Link
              to="https://www.epassport.gov.bd/landing"
              target="_blank"
              className="hover:underline"
            >
              বাংলাদেশ ই-পাসপোর্ট পোর্টাল
            </Link>
          </div>
          <div className={sectionItemClass}>
            <Link
              to="https://eboardresults.com/en/ebr.app/home/"
              target="_blank"
              className="hover:underline"
            >
              {" "}
              ফলাফল প্রকাশের সিস্টেম (শিক্ষা বোর্ড)
            </Link>
          </div>
          <div className={sectionItemClass}>
            <Link
              to="https://bteb.gov.bd/"
              target="_blank"
              className="hover:underline"
            >
              বাংলাদেশ কারিগরি শিক্ষা বোর্ড
            </Link>
          </div>
        </div>

        {/* Contact Info & Follow */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className={contactTitleClass}>যোগাযোগ</div>
            <div className={contactItemClass}>
              মোবাইল:{" "}
              <a href={`tel:${settings?.phone || "01888666619"}`}>
                {settings?.phone || "01888666619, 01864776487"}
              </a>
            </div>

            <div className={contactItemClass}>
              ইমেইল:{" "}
              <a href={`mailto:${settings?.email || "amadershikka@gmail.com"}`}>
                {settings?.email || "amadershikka@gmail.com"}
              </a>
            </div>

            <div className={contactItemClass}>
              ঠিকানা: {settings?.address || "Bashundhara, Dhaka"}
            </div>
          </div>
          {/* <div className="flex flex-col gap-3">
            <div className={followTitleClass}>ফলো করুন</div>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  name: "facebook",
                  icon: <FaFacebookF size={16} />,
                  color: "bg-blue-600",
                  hover: "hover:bg-blue-700",
                },
                {
                  name: "x",
                  icon: <FaTwitter size={16} />,
                  color: "bg-sky-500",
                  hover: "hover:bg-sky-600",
                },
                {
                  name: "linkedin",
                  icon: <FaLinkedinIn size={16} />,
                  color: "bg-blue-800",
                  hover: "hover:bg-blue-900",
                },
                {
                  name: "youtube",
                  icon: <FaYoutube size={16} />,
                  color: "bg-red-600",
                  hover: "hover:bg-red-700",
                },
                {
                  name: "instagram",
                  icon: <FaInstagram size={16} />,
                  color: "bg-pink-600",
                  hover: "hover:bg-pink-700",
                },
                {
                  name: "tiktok",
                  icon: <FaTiktok size={16} />,
                  color: "bg-black",
                  hover: "hover:bg-gray-900",
                },
              ]
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
                      className={`w-8 h-8 flex items-center justify-center ${item.color} rounded-full text-white ${item.hover} transition-colors cursor-pointer`}
                    >
                      {item.icon}
                    </a>
                  );
                })}
            </div>
          </div> */}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className={hrClass}></div>
        <div className="grid grid-cols-1 gap-2 text-center">
          <div>
            <span className={`${footerTextClass} font-['Poppins']`}>
              {settings?.footer_text
                ? settings.footer_text
                : "© 2025 amadershikka. স্বর্বসত্ব সংরক্ষিত."}
            </span>
          </div>
          <div className={`${footerTextClass}  `}>
            প্রযুক্তিক সহযোগিতায়:{" "}
            <Link
              className="hover:underline"
              to="https://genzsoft.cloud/"
              alt="_blank"
            >
              {" "}
              GenzSoft.Cloud
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
