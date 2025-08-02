import React, { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Certificates from "../components/Certificates";
import FloatingContact from "../components/FloatingContact";
import Hero from "../components/Hero";
import OurCourses from "../components/OurCourses";
import OurThoughts from "../components/OurThoughts";
import OurWork from "../components/OurWork";
import Review from "../components/Review";
import Stats from "../components/Stats";
import WhyChooseUS from "../components/WhyChooseUS";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import OurTrainer from "../components/OurTrainer";




const Home = () => {
  const [PrimaryColor, setButtonColor] = useState('#FFFF');
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Fetch and cache site settings (button color, primary color, footer color)
  useEffect(() => {
    const cacheKey = 'siteSettingsCache';
    const cacheExpiry = 1000 * 60 * 60 * 6; // 6 hours
    const cached = localStorage.getItem(cacheKey);
    let useCache = false;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < cacheExpiry) {
          // Use cached values
          if (parsed.primary_color) setButtonColor(parsed.primary_color);
          // You can also set other colors here if needed
          useCache = true;
        }
      } catch (e) { /* ignore */ }
    }
    if (!useCache) {
      fetchSiteSettings()
        .then((data) => {
          if (data && data.primary_color) {
            setButtonColor(data.primary_color);
          }
          // Store in cache
          localStorage.setItem(cacheKey, JSON.stringify({
            ...data,
            timestamp: Date.now(),
          }));
        })
        .catch(() => { });
    }
  }, []);

  return (
    <>
      <section>
        <section className="w-full  "
          // style={{
          //   background: `linear-gradient(255deg, #EFFBF7 1.64%, ${PrimaryColor} 98.36%)`,
          // }}
          >
          <Hero></Hero>
        </section>
        <OurCourses></OurCourses>
        <section className="">
          <OurThoughts></OurThoughts>
          {/* <OurWork></OurWork> */}
          <WhyChooseUS></WhyChooseUS>
          <OurTrainer></OurTrainer>
          <Stats></Stats>
        </section>
        {/* <Stats></Stats> */}
          <section className="mx-auto p-2 sm:p-6 mb-6 relative overflow-hidden bg-[#ffffff]">


          <div className="relative z-10">
            <Review></Review>
            <Certificates></Certificates>
          </div>
        </section>
        <FloatingContact />
      </section>
    </>
  );
};

export default Home;
