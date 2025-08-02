import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import ScrollToTopComponent from "../components/ScrollToTop";
import Footer from "../components/sharedComponents/Footer";
import Navbar from "../components/sharedComponents/NavbarNew";
import SpecialDeal from "../components/SpecialDeal/SpecialDeal";
import { fetchSiteSettings } from "../config/siteSettingsApi";

const Root = () => {
  const [primaryColor, setPrimaryColor] = useState('#FC5D43');
  const [scrollThreshold, setScrollThreshold] = useState(window.innerHeight * 3); // 200vh

  // Update scroll threshold on window resize
  useEffect(() => {
    const handleResize = () => {
      setScrollThreshold(window.innerHeight * 3); // 200vh
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch button color from site settings
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.primary_color) {
          setPrimaryColor(data.primary_color);
        }
      })
      .catch(() => { });
  }, []);


  useEffect(() => {
    fetchSiteSettings()
      .then((settings) => {
        // Update document title
        if (settings.site_title) {
          document.title = settings.site_title;
        }

        // Update favicon
        if (settings.favicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = settings.favicon;
        }

        // Inject meta_tag HTML directly into <head>
        if (settings.meta_tag) {
          // Remove any previously injected meta tags (optional, for cleanup)
          const prev = document.querySelectorAll('meta[data-dynamic-meta]');
          prev.forEach(el => el.parentNode.removeChild(el));

          // Create a temporary container to parse the HTML string
          const temp = document.createElement('div');
          temp.innerHTML = settings.meta_tag;

          // Append each meta tag to the head
          Array.from(temp.children).forEach((el) => {
            if (el.tagName === 'META') {
              el.setAttribute('data-dynamic-meta', 'true');
              document.head.appendChild(el);
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching site settings:", error);
      });
  }, []);

  // Helper function to update or create meta tags
  

  return (
    <div>
      <ScrollToTopComponent />
      <SpecialDeal />
      <Navbar />
      <ScrollToTop
        smooth
        top={scrollThreshold}
        component={<FaArrowUp className="text-white" />}
        className=" !rounded-full !w-12 !h-12 !flex !items-center !justify-center !shadow-md !animate-bounce !z-[9999]"
        style={{ backgroundColor: primaryColor }}
      />

      <main className="lg:pt-40 pt-56 md:pt-40">
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Root;
