import React, { useEffect, useState, useRef } from "react";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { CountUp } from 'countup.js';
import icon1 from "../assets/Stats/1.png";
import icon2 from "../assets/Stats/2.png";
import icon3 from "../assets/Stats/3.png";
import icon4 from "../assets/Stats/4.png";
import { Api_Base_Url, Site_Id } from "../config/api";

const Stats = () => {
  // Primary color for gradient background
  const [primaryColor, setPrimaryColor] = useState('#FFF');

  // Fetch Primary color from site settings
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.primary_color) {
          setPrimaryColor(data.primary_color);
        }
      })
      .catch(() => {});
  }, []);

  // Helper: convert hex to rgba with alpha
  function hexToRgba(hex, alpha = 0.15) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  const [stats, setStats] = useState({
    total_courses: 0,
    total_instructors: 0,
    current_students: 0,
    passed_students: 0,
  });
  
  // Refs for animated numbers
  const coursesRef = useRef(null);
  const instructorsRef = useRef(null);
  const studentsRef = useRef(null);
  const passedRef = useRef(null);
  const sectionRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats data
  useEffect(() => {
    setLoading(true);
    fetch(`${Api_Base_Url}/platform-summary`, {
      headers: {
        "Site-Id": Site_Id,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Animate numbers on scroll into view (every time it comes into view)
  useEffect(() => {
    if (loading || !stats || Object.keys(stats).length === 0) return;
    
    // Create array of stats to show only those with values > 0
    const currentStatsToShow = [
      { ref: coursesRef, value: stats.total_courses, name: 'courses' },
      { ref: instructorsRef, value: stats.total_instructors, name: 'instructors' },
      { ref: studentsRef, value: stats.current_students, name: 'students' },
      { ref: passedRef, value: stats.passed_students, name: 'passed' }
    ].filter(stat => stat.value > 0);
    
    const animateCounters = () => {
      // Add delay to ensure DOM is ready
      setTimeout(() => {
        currentStatsToShow.forEach(({ ref, value, name }) => {
          if (ref.current && value !== undefined && value !== null) {
            // Set initial value to 0
            ref.current.textContent = '0';
            
            try {
              const countUp = new CountUp(ref.current, value, {
                duration: 2.5,
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.'
              });
              
              if (!countUp.error) {
                countUp.start();
              } else {
                console.error(`CountUp error for ${name}:`, countUp.error);
                // Fallback: just set the final value
                ref.current.textContent = value.toLocaleString();
              }
            } catch (error) {
              console.error(`Error creating CountUp for ${name}:`, error);
              // Fallback: just set the final value
              ref.current.textContent = value.toLocaleString();
            }
          }
        });
      }, 150);
    };

    const resetCounters = () => {
      // Reset only visible counters to 0 when leaving view
      currentStatsToShow.forEach(stat => {
        if (stat.ref.current) {
          stat.ref.current.textContent = '0';
        }
      });
    };

    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is coming into view - animate
            animateCounters();
          } else {
            // Element is leaving view - reset to 0
            resetCounters();
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '50px'
      }
    );
    
    if (node) {
      observer.observe(node);
    }
    
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [loading, stats]);

  if (loading) {
    return (
      <section className="flex items-center justify-center min-h-[50vh] w-full bg-gradient-to-b from-[#FFF7F0] to-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1284px] py-12 px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <div className="text-lg font-medium text-gray-600">Loading stats...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex items-center justify-center min-h-[50vh] w-full bg-gradient-to-b from-[#FFF7F0] to-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1284px] py-12 px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <div className="text-lg font-medium text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  // Create array of stats to show only those with values > 0
  const statsToShow = [
    {
      ref: coursesRef,
      value: stats.total_courses,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path d="M16.9998 8.6001V28.2001" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round"/>
          <path d="M8.57254 4.79952C13.2502 5.69015 16.0381 7.55314 16.9998 8.6227C17.9614 7.55314 20.7492 5.69015 25.4269 4.79952C27.7967 4.34832 28.9815 4.12272 29.9906 4.9874C30.9998 5.85208 30.9998 7.25621 30.9998 10.0645V20.1569C30.9998 22.7246 30.9998 24.0084 30.3521 24.8101C29.7045 25.6116 28.2787 25.883 25.4269 26.4261C22.8849 26.9101 20.901 27.6812 19.4649 28.4562C18.052 29.2187 17.3456 29.5999 16.9998 29.5999C16.654 29.5999 15.9475 29.2187 14.5346 28.4562C13.0986 27.6812 11.1146 26.9101 8.57254 26.4261C5.72087 25.883 4.29504 25.6116 3.6474 24.8101C2.99976 24.0084 2.99976 22.7246 2.99976 20.1569V10.0645C2.99976 7.25621 2.99976 5.85208 4.00885 4.9874C5.01795 4.12272 6.20282 4.34832 8.57254 4.79952Z" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "বর্তমান কোর্স"
    },
    {
      ref: instructorsRef,
      value: stats.total_instructors,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path d="M22.0258 25.0366C21.1455 25.6263 18.8375 26.8304 20.2432 28.3371C20.9299 29.0731 21.6949 29.5995 22.6564 29.5995H25.3998H28.1433C29.1048 29.5995 29.8698 29.0731 30.5565 28.3371C31.9622 26.8304 29.6542 25.6263 28.7738 25.0366C26.7095 23.6538 24.0901 23.6538 22.0258 25.0366Z" stroke="#141B34" strokeWidth="2.1"/>
          <path d="M28.1997 17.6999C28.1997 19.2463 26.9462 20.4999 25.3997 20.4999C23.8533 20.4999 22.5997 19.2463 22.5997 17.6999C22.5997 16.1535 23.8533 14.8999 25.3997 14.8999C26.9462 14.8999 28.1997 16.1535 28.1997 17.6999Z" stroke="#141B34" strokeWidth="2.1"/>
          <path d="M14.1997 8.5999H21.1997M14.1997 4.3999H25.3997" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.99976 13.5V19.8001C9.99976 21.12 9.99976 21.7799 9.58971 22.19C9.17965 22.6001 8.51969 22.6001 7.19976 22.6001H5.79976C4.47982 22.6001 3.81986 22.6001 3.4098 22.19C2.99976 21.7799 2.99976 21.12 2.99976 19.8001V16.3001C2.99976 14.9801 2.99976 14.3202 3.4098 13.91C3.81986 13.5 4.47982 13.5 5.79976 13.5H9.99976ZM9.99976 13.5H16.9998" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.29971 7.1999C9.29971 8.7463 8.04611 9.9999 6.49971 9.9999C4.95331 9.9999 3.69971 8.7463 3.69971 7.1999C3.69971 5.6535 4.95331 4.3999 6.49971 4.3999C8.04611 4.3999 9.29971 5.6535 9.29971 7.1999Z" stroke="#141B34" strokeWidth="2.1"/>
        </svg>
      ),
      label: "ইন্সট্রাক্টর"
    },
    {
      ref: studentsRef,
      value: stats.current_students,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path d="M2.99976 11.3999C2.99976 13.2784 14.3326 18.3999 16.9803 18.3999C19.6278 18.3999 30.9608 13.2784 30.9608 11.3999C30.9608 9.52141 19.6278 4.3999 16.9803 4.3999C14.3326 4.3999 2.99976 9.52141 2.99976 11.3999Z" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.59155 15.6001L8.93471 23.482C8.94157 23.6397 8.95863 23.7978 9.00437 23.949C9.14573 24.4163 9.40627 24.8409 9.80376 25.1263C12.9138 27.358 21.0459 27.358 24.1559 25.1263C24.5536 24.8409 24.814 24.4163 24.9554 23.949C25.001 23.7978 25.0181 23.6397 25.0251 23.482L25.3681 15.6001" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28.8624 13.5V23.3M28.8624 23.3C27.7536 25.3248 27.2633 26.4097 26.7654 28.2C26.6573 28.837 26.7431 29.158 27.1821 29.4431C27.3605 29.5588 27.5748 29.6 27.7874 29.6H29.9159C30.1423 29.6 30.3706 29.5528 30.557 29.4243C30.9651 29.1429 31.0701 28.8342 30.9595 28.2C30.523 26.5376 29.9669 25.4011 28.8624 23.3Z" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "শিক্ষার্থী"
    },
    {
      ref: passedRef,
      value: stats.passed_students,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path d="M26.7997 7.2L16.9997 3L7.19971 7.2L12.0997 9.3V12.1C12.0997 12.1 13.733 11.4 16.9997 11.4C20.2663 11.4 21.8997 12.1 21.8997 12.1V9.3L26.7997 7.2ZM26.7997 7.2V12.8" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21.8997 12.1001V13.5001C21.8997 16.2063 19.7059 18.4001 16.9997 18.4001C14.2935 18.4001 12.0997 16.2063 12.0997 13.5001V12.1001" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.0953 23.5848C9.55476 24.5431 5.51559 26.4997 7.97572 28.948C9.17748 30.144 10.5159 30.9994 12.1987 30.9994H21.8007C23.4835 30.9994 24.8219 30.144 26.0237 28.948C28.4838 26.4997 24.4446 24.5431 22.9041 23.5848C19.2916 21.3376 14.7078 21.3376 11.0953 23.5848Z" stroke="#141B34" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "কোর্স সম্পূর্ণ করেছেন"
    }
  ].filter(stat => stat.value > 0);

  // If no stats to show, return null or a message
  if (statsToShow.length === 0) {
    return (
      <section className="flex items-center justify-center min-h-[50vh] w-full bg-gradient-to-b from-[#FFF7F0] to-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1284px] py-12 px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <div className="text-lg font-medium text-gray-500">No statistics available at the moment.</div>
        </div>
      </section>
    );
  }

  // Determine grid columns based on number of stats
  const getGridCols = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  };

  return (
    <section 
      ref={sectionRef}
      className="flex items-center justify-center bg-[#a6a7a31f] min-h-[30vh] w-full px-4 sm:px-6 lg:px-8"
      // style={{
      //   background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.15)} 0%, #fff 100%)`
      // }}
    >
      <div className="w-full max-w-[1284px] py-8 px-4 sm:px-6 lg:px-8 mx-auto">
        <div className={`grid ${getGridCols(statsToShow.length)} gap-8 justify-center`}>
          {statsToShow.map((stat, index) => (
            <div
              key={index}
              className="flex flex-row items-center bg-white rounded-xl shadow-lg p-4 md:p-6 transition-transform hover:-translate-y-2 hover:shadow-2xl duration-200 min-w-[240px] max-w-[320px] mx-auto"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-[#FFF7F0] rounded-lg shadow-sm mr-4">
                {stat.svg}
              </div>
              <div className="flex flex-col items-start justify-center">
                <span ref={stat.ref} className="text-black text-2xl md:text-3xl font-bold mb-1">{stat.value}</span>
                <span className="text-gray-700 text-base md:text-lg font-medium">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;