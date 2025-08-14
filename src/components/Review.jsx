import React, { useEffect, useState, useRef } from "react";
import { Api_Base_Url, Site_Id } from "../config//api";

const Review = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${Api_Base_Url}/reviews`, {
      headers: {
        "Site-Id": Site_Id,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        
        setData(resData);
        setLoading(false);
      })
      .catch(() => {
        setError("ডেটা লোড করা যায়নি। দয়া করে পরে আবার চেষ্টা করুন।");
        setLoading(false);
      });
  }, []);

  const handleMouseEnter = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.animationPlayState = 'running';
    }
  };

  if (loading) {
    return (
      <section className="mt-96 lg:mt-[135px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto min-h-[400px] flex items-center justify-center text-lg font-semibold text-gray-700">
         
        </div>
      </section>
    );
  }

  if (error || !data) {
    return null; // Don't show the section if there's an error or no data
  }

  // Check if there are reviews in the API response
  // Look for common review-related fields in the API response
  const hasReviews =
    data.reviews ||
    data.testimonials ||
    data.feedback ||
    (Array.isArray(data) && data.length > 0) ||
    (data.data && Array.isArray(data.data) && data.data.length > 0) ||
    (data.results && Array.isArray(data.results) && data.results.length > 0);

  // If no reviews found in API response, don't show the section
  if (!hasReviews) {
    return null;
  }

  // Extract reviews from the API response
  const reviews =
    data.reviews ||
    data.testimonials ||
    data.feedback ||
    data.data ||
    data.results ||
    [];

  // Create duplicated reviews for seamless infinite scroll
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  const ReviewCard = ({ review, index }) => (
    <div
      key={`${review.id || index}-${Math.random()}`}
      className="w-[304px] p-7 sm:p-8 rounded-xl outline outline-1 outline-offset-[-0.5px] outline-gray-700 flex flex-col justify-start items-start gap-2.5 overflow-hidden flex-shrink-0"
    >
      <div className="flex flex-col justify-start items-start gap-4 w-full">
        {/* Stars - only show if rating exists */}
        {(review.rating || review.stars) && (
          <div className="flex justify-start items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="12" height="13" viewBox="0 0 12 13" fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.2352 0.527388L7.94744 4.16622L11.775 4.74988C11.8741 4.76528 11.9563 4.83803 11.9872 4.93766C12.018 5.03729 11.9922 5.1466 11.9206 5.2198L9.15147 8.05161L9.80527 12.051C9.82246 12.1541 9.78207 12.2585 9.70111 12.3202C9.62016 12.3818 9.51273 12.3899 9.4241 12.3412L6.00039 10.4533L2.57668 12.3417C2.48811 12.3907 2.38063 12.3826 2.29962 12.321C2.21862 12.2594 2.17823 12.155 2.19551 12.0518L2.84931 8.05161L0.0794018 5.2198C0.00776235 5.1466 -0.018026 5.03729 0.0128386 4.93766C0.0437032 4.83803 0.125893 4.76528 0.224981 4.74988L4.05256 4.16622L5.76559 0.527388C5.80918 0.433297 5.90038 0.373535 6.00039 0.373535C6.1004 0.373535 6.1916 0.433297 6.2352 0.527388Z"
                  fill={i < (review.rating || review.stars || 5) ? "#F59E0B" : "#D1D5DB"}
                />
              </svg>
            ))}
          </div>
        )}

        {/* Text - only show if comment exists */}
        {(review.comment ||
          review.text ||
          review.feedback ||
          review.description) && (
          <p className="text-zinc-900 text-sm font-normal leading-snug">
            {review.comment ||
              review.text ||
              review.feedback ||
              review.description}
          </p>
        )}

        {/* User info - only show if name exists */}
        {(review.name || review.student_name || review.user_name) && (
          <div className="flex justify-start items-center gap-3 w-full">
            <div className="flex items-center justify-center bg-gray-200 rounded-full" style={{width:'44px',height:'44px',minWidth:'44px',minHeight:'44px',overflow:'hidden'}}>
              {review.user_img ? (
                <img
                  src={review.user_img}
                  alt={review.name || review.student_name || review.user_name}
                  className="object-cover rounded-full"
                  style={{width:'44px',height:'44px'}}
                  onError={(e) => {
                    e.target.src = '/pfp.jpg';
                  }}
                />
              ) : (
                <img
                  src="/pfp.jpg"
                  alt={review.name || review.student_name || review.user_name}
                  className="object-cover rounded-full"
                  style={{width:'44px',height:'44px'}}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-xs font-medium text-gray-700">${(review.name || review.student_name || review.user_name)[0]}</span>`;
                  }}
                />
              )}
            </div>
            <div className="flex flex-col justify-start items-start gap-0.5 w-full">
              <p className="text-zinc-900 text-sm font-bold">
                {review.name || review.student_name || review.user_name}
              </p>
              {/* Course name in one line with ellipsis */}
              {(review.course_name || review.batch || review.position) && (
                <p className="text-zinc-600 text-xs text-start font-normal truncate w-full" style={{maxWidth:'180px'}} title={review.course_name || review.batch || review.position}>
                  {review.course_name || review.batch || review.position}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes scrollRightToLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${(reviews.length * 328)}px);
          }
        }
        
        .scroll-container {
          animation: scrollRightToLeft ${reviews.length * 3}s linear infinite;
        }
        
        .scroll-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        
        /* Apply gradients only on large screens */
        @media (min-width: 1024px) { /* Equivalent to Tailwind's lg breakpoint */
          .scroll-wrapper::before,
          .scroll-wrapper::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 50px;
            z-index: 10;
            pointer-events: none;
          }
          
          .scroll-wrapper::before {
            left: 0;
            background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
          }
          
          .scroll-wrapper::after {
            right: 0;
            background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
          }
        }
      `}</style>
      
      <section className="text-center py-1 mt-2 px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-2xl sm:text-3xl lg:text-4xl font-bold">
          শিক্ষার্থীদের মন্তব্য
        </h2>
        
        <div className="scroll-wrapper p-2 max-w-7xl mx-auto">
          <div 
            ref={scrollContainerRef}
            className="scroll-container flex gap-6"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ width: `${duplicatedReviews.length * 328}px` }}
          >
            {duplicatedReviews.map((review, index) => (
              <ReviewCard key={`review-${index}`} review={review} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Review;


