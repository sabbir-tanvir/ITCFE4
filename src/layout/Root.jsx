import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import ScrollToTopComponent from "../components/ScrollToTop";
import Footer from "../components/sharedComponents/Footer";
import Navbar from "../components/sharedComponents/NavbarNew";
import SpecialDeal from "../components/SpecialDeal/SpecialDeal";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import DomainExpired from "../pages/DomainExpired";


const Root = () => {
  const [primaryColor, setPrimaryColor] = useState('#FC5D43');
  const [scrollThreshold, setScrollThreshold] = useState(window.innerHeight * 3); // 200vh
    const [isLoading, setIsLoading] = useState(true);
      const [domainExpired, setDomainExpired] = useState(false);



  // Update scroll threshold on window resize
  useEffect(() => {
    const handleResize = () => {
      setScrollThreshold(window.innerHeight * 3); // 200vh
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Fetch button color from site settings

    // Fetch button color from site settings
  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings()
      .then((data) => {
        if (cancelled) return;
        if (data?._expired) {
          setDomainExpired(true);
          setIsLoading(false);
          return;
        }
        if (data && data.primary_color) {
          setPrimaryColor(data.primary_color);
        }
        // Also handle meta here to avoid second fetch
        if (data && !data?._expired) {
          if (data.site_title) document.title = data.site_title;
          if (data.favicon) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
            link.href = data.favicon;
          }
          if (data.meta_tag) {
            const prev = document.querySelectorAll('meta[data-dynamic-meta]');
            prev.forEach(el => el.parentNode.removeChild(el));
            const temp = document.createElement('div');
            temp.innerHTML = data.meta_tag;
            Array.from(temp.children).forEach((el) => {
              if (el.tagName === 'META') { el.setAttribute('data-dynamic-meta','true'); document.head.appendChild(el); }
            });
          }
        }
        setIsLoading(false);
      })
      .catch(() => { 
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);


  // Removed second fetch effect; first effect handles meta & expiration.

  // Helper function to update or create meta tags


  if (domainExpired) {
    return <DomainExpired />;
  }


  return (
    <div>
      <ScrollToTopComponent />
      <SpecialDeal />
      <Navbar />
      {isLoading ? (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      ) : (
        <ScrollToTop
          smooth
          top={scrollThreshold}
          component={<FaArrowUp className="text-white" />}
          className=" !rounded-full !w-12 !h-12 !flex !items-center !justify-center !shadow-md !animate-bounce !z-[9999]"
          style={{ backgroundColor: primaryColor }}
        />
      )}

      <main className="lg:pt-28 pt-32 md:pt-32">
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Root;
