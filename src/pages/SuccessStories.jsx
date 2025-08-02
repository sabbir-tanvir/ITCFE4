import { useEffect, useState, useRef } from "react";
import { Api_Base_Url, Site_Id } from "../config/api";
import { ShimmerPostItem } from "react-shimmer-effects";

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showExpandButton, setShowExpandButton] = useState({});
  
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Function to check if text is being truncated
  const checkTextTruncation = (elementId, storyId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const height = element.offsetHeight;
      const lines = Math.round(height / lineHeight);
      
      // If the element has more than 2 lines worth of content, show expand button
      setShowExpandButton(prev => ({
        ...prev,
        [storyId]: element.scrollHeight > element.offsetHeight || lines > 2
      }));
    }
  };

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${Api_Base_Url}/success-stories`, {
          headers: {
            "Site-Id": Site_Id,
          },
        });
        if (!response.ok) throw new Error("ডেটা লোড করা যায়নি।");
        const data = await response.json();
        setStories(data.results || []);
      } catch (err) {
        setError(err.message || "ডেটা লোড করা যায়নি।");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  // Check truncation after stories are loaded and rendered
  useEffect(() => {
    if (stories.length > 0) {
      setTimeout(() => {
        stories.forEach(story => {
          checkTextTruncation(`description-${story.id}`, story.id);
        });
      }, 100); // Small delay to ensure DOM is rendered
    }
  }, [stories]);

  if (loading) {
    return (
      <section className="mt-[80px] md:mt-[120px] lg:mt-[147px]">
        <div className="max-w-[1440px] mx-auto px-4 min-h-[400px] flex flex-col gap-8 items-center justify-center">
          {[1,2,3].map((i) => (
            <div key={i} className="w-full md:w-[900px] bg-white rounded-xl p-6 shadow-md">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-[300px] h-[300px] rounded-xl overflow-hidden">
                  <ShimmerPostItem card imageHeight={300} contentHeight={40} />
                </div>
                <div className="flex-1 w-full">
                  <ShimmerPostItem title text cta imageHeight={0} contentHeight={120} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-[80px] md:mt-[120px] lg:mt-[147px]">
        <div className="max-w-[1440px] mx-auto px-4 min-h-[400px] flex items-center justify-center text-lg font-semibold text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-[40px] md:mt-[40px] mb-[40px] lg:mt-[47px]">
      <div className="max-w-[1440px] mx-auto px-4 xl:px-12">
        <h1 className="text-[32px] md:text-[36px] lg:text-[40px] font-hind-siliguri font-semibold text-center mb-12">
          সফলতার গল্প
        </h1>

        <div className="space-y-12">
          {stories.map((story) => {
            const shouldShowExpanded = expanded[story.id];
            const shouldShowButton = showExpandButton[story.id];
            
            return (
              <div
                key={story.id}
                className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-xl p-6 shadow-md"
              >
                {/* Student Image */}
                <div className="w-full md:w-[300px] h-[300px] rounded-xl overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Testimonial Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {story.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold font-hind-siliguri">
                        {story.name}
                      </h3>
                    </div>
                  </div>

                  <div>
                    <p
                      id={`description-${story.id}`}
                      className={`text-gray-700 text-lg leading-relaxed font-hind-siliguri text-justify ${
                        !shouldShowExpanded && shouldShowButton ? 'line-clamp-2' : ''
                      }`}
                      style={{
                        display: !shouldShowExpanded && shouldShowButton ? '-webkit-box' : 'block',
                        WebkitLineClamp: !shouldShowExpanded && shouldShowButton ? 2 : 'unset',
                        WebkitBoxOrient: !shouldShowExpanded && shouldShowButton ? 'vertical' : 'unset',
                        overflow: !shouldShowExpanded && shouldShowButton ? 'hidden' : 'visible',
                      }}
                    >
                      {story.description}
                    </p>
                    
                    {/* Show expand/collapse button only if text is actually being truncated */}
                    {shouldShowButton && (
                      <button
                        className="text-blue-600 cursor-pointer mt-2 hover:text-blue-800 transition-colors"
                        onClick={() => toggleExpand(story.id)}
                      >
                        {shouldShowExpanded ? 'কম দেখুন' : 'আরও দেখুন'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;