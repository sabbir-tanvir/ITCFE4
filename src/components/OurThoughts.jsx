import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MissionVision from "../assets/Mission Vission/marketeq_goal1.png";
import Strategy from "../assets/Mission Vission/marketeq_goal2.png";
import SuccessStory from "../assets/Mission Vission/marketeq_goal3.png";
import Facilities from "../assets/Mission Vission/marketeq_goal4.png";
import { fetchSiteSettings } from "../config/siteSettingsApi";
import { ShimmerText, ShimmerButton, ShimmerThumbnail } from "react-shimmer-effects";

const OurThoughts = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    points: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // State for API data for cards 1, 2, 4
  const [missionVision, setMissionVision] = useState({
    title: "",
    points: [],
  });
  const [strategy, setStrategy] = useState({
    title: "",
    points: [],
  });
  const [facilities, setFacilities] = useState({
    title: "",
    points: [],
  });

  // State for 'আমাদের কথা' section
  const [ourTalk, setOurTalk] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    setIsLoading(true);
    fetchSiteSettings()
      .then((data) => {
        // Card 1: mission_vision
        if (data && data.mission_vision) {
          const parser = new window.DOMParser();
          const doc = parser.parseFromString(data.mission_vision, "text/html");
          const h2 = doc.querySelector("h2");
          const lis = Array.from(doc.querySelectorAll("li")).map((li) =>
            li.textContent.trim()
          );
         
          
          setMissionVision({
            title: h2 ? h2.textContent : "",
            points: lis.length > 0 ? lis : [],
          });
        }
        // Card 2: our_strategy
        if (data && data.our_strategy) {
          const parser = new window.DOMParser();
          const doc = parser.parseFromString(data.our_strategy, "text/html");
          const h2 = doc.querySelector("h2");
          const lis = Array.from(doc.querySelectorAll("li")).map((li) =>
            li.textContent.trim()
          );
          setStrategy({
            title: h2 ? h2.textContent : "",
            points: lis.length > 0 ? lis : [],
          });
        }
        // Card 4: opportunity
        if (data && data.opportunity) {
          const parser = new window.DOMParser();
          const doc = parser.parseFromString(data.opportunity, "text/html");
          const h2 = doc.querySelector("h2");
          const lis = Array.from(doc.querySelectorAll("li")).map((li) =>
            li.textContent.trim()
          );
          setFacilities({
            title: h2 ? h2.textContent : "",
            points: lis.length > 0 ? lis : [],
          });
        }
        // আমাদের কথা: our_talk
        if (data && data.our_talk) {
          const parser = new window.DOMParser();
          const doc = parser.parseFromString(data.our_talk, "text/html");
          const h2 = doc.querySelector("h2");
          // Try to get all content after h2, or fallback to the whole HTML
          let content = "";
          if (h2 && h2.nextElementSibling) {
            // Collect all siblings after h2
            let node = h2.nextElementSibling;
            while (node) {
              content += node.outerHTML || node.textContent;
              node = node.nextElementSibling;
            }
          } else {
            // fallback to all innerHTML
            content = doc.body.innerHTML;
          }
          setOurTalk({
            title: h2 ? h2.textContent : "",
            content: content || data.our_talk,
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        // fallback to default
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  const modalContents = {
    mission: missionVision,
    strategy: strategy,
    facilities: facilities,
  };

  const handleModalOpen = (type) => {
    if (type === "success") {
      navigate("/success-stories");
      return;
    }
    setModalContent(modalContents[type]);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Helper to strip HTML and truncate to 150 words
  // function getTruncatedText(html, wordLimit = 150) {
  //   const div = document.createElement("div");
  //   div.innerHTML = html;
  //   const text = div.textContent || div.innerText || "";
  //   const words = text.split(/\s+/);
  //   if (words.length <= wordLimit) return text;
  //   return words.slice(0, wordLimit).join(" ") + " ...";
  // }

  // Add this utility function near the top of the file (after imports)
  function removeDateFromContent(content) {
    if (!content) return content;
    // Remove a date like "📅১৩.০৫.২০২১" at the start, possibly inside a <div>
    // Handles both plain text and <div> wrapped date
    return content
      .replace(/^<div>\s*📅[\d০-৯.\-/]+<\/div>\s*/u, '')
      .replace(/^📅[\d০-৯.\-/]+\s*/u, '');
  }


  // State for see more/less in ourTalk
  const [showFullOurTalk, setShowFullOurTalk] = useState(false);
  // Helper to strip HTML and get words
  function getWordsFromHtml(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.split(/\s+/);
  }
  const ourTalkWords = getWordsFromHtml(removeDateFromContent(ourTalk.content));
  const ourTalkHasMore = ourTalkWords.length > 120;
  const ourTalkTruncated = ourTalkHasMore ? ourTalkWords.slice(0, 120).join(" ") + " ..." : ourTalkWords.join(" ");

  return (
    <section className="flex items-center justify-center min-h-[60vh] mt-[80px] mx-4 lg:pb-10 md:mt-[120px] lg:mt-[44px]">
      <div className="max-w-[1440px] w-full mx-auto px-4">
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-[35px] items-center justify-center w-full">
          {/* Left: আমাদের কথা section */}
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
            <div className="flex flex-col justify-center items-start gap-[2px]">
              {isLoading ? (
                <>
                  <ShimmerText line={1} gap={0} variant="primary" className="w-full lg:w-[618px] h-[38px] md:h-[44px] lg:h-[52px] rounded bg-gray-200 mb-2" />
                  <ShimmerText line={3} gap={8} variant="primary" className="w-full lg:w-[744px] h-[72px] md:h-[80px] lg:h-[90px] rounded bg-gray-200" />
                </>
              ) : (
                <>
                  <div className="w-full lg:w-[618px] text-black text-[24px] md:text-[28px] lg:text-[32px] font-hind-siliguri font-semibold">
                    {ourTalk.title}
                  </div>
                  <div className="w-full lg:w-[800px] text-black text-[16px] md:text-[17px] lg:text-[18px] font-hind-siliguri font-normal text-justify">
                    {ourTalk.content ? (
                      <>
                        <span>
                          {showFullOurTalk ? ourTalkWords.join(" ") : ourTalkTruncated}
                        </span>
                        {ourTalkHasMore && (
                          <button
                            className="text-blue-600 cursor-pointer ml-2 hover:text-blue-800 transition-colors text-[15px] font-medium"
                            onClick={() => setShowFullOurTalk((prev) => !prev)}
                          >
                            {showFullOurTalk ? 'কম দেখুন' : 'আরও দেখুন'}
                          </button>
                        )}
                      </>
                    ) : (
                      <span>Loading...</span>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* <div className="w-[180px] md:w-[205px] px-[22px] py-[8px] bg-button hover:bg-button-hover rounded flex justify-center items-center gap-[10px]">
              <div className="text-white text-[14px] md:text-[16px] font-hind-siliguri font-medium">
                <Link to="/OurOpinion">বিস্তারিত</Link>
              </div>
            </div> */}
          </div>
          {/* Right: Cards section */}
          <div className="w-full lg:w-[372px] flex flex-col mb-8 items-start gap-6 lg:gap-[24px]">
            {isLoading ? (
              <>
                <div className="grid grid-cols-2 gap-4 lg:gap-[24px] w-full">
                  <div className="w-full p-2 bg-white flex flex-col items-center gap-[8px]">
                    <ShimmerThumbnail height={48} rounded className="w-[48px] h-[48px] mb-2 bg-gray-200" />
                    <ShimmerText line={1} gap={0} className="w-[80%] h-[20px] bg-gray-200 mb-2" />
                    <ShimmerButton className="w-full h-[33px] bg-gray-200" />
                  </div>
                  <div className="w-full p-2 bg-white flex flex-col items-center gap-[8px]">
                    <ShimmerThumbnail height={48} rounded className="w-[48px] h-[48px] mb-2 bg-gray-200" />
                    <ShimmerText line={1} gap={0} className="w-[80%] h-[20px] bg-gray-200 mb-2" />
                    <ShimmerButton className="w-full h-[33px] bg-gray-200" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 lg:gap-[24px] w-full">
                  <div className="w-full p-2 bg-white flex flex-col items-center gap-[8px]">
                    <ShimmerThumbnail height={48} rounded className="w-[48px] h-[48px] mb-2 bg-gray-200" />
                    <ShimmerText line={1} gap={0} className="w-[80%] h-[20px] bg-gray-200 mb-2" />
                    <ShimmerButton className="w-full h-[33px] bg-gray-200" />
                  </div>
                  <div className="w-full p-2 bg-white flex flex-col items-center gap-[8px]">
                    <ShimmerThumbnail height={48} rounded className="w-[48px] h-[48px] mb-2 bg-gray-200" />
                    <ShimmerText line={1} gap={0} className="w-[80%] h-[20px] bg-gray-200 mb-2" />
                    <ShimmerButton className="w-full h-[33px] bg-gray-200" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 lg:gap-[24px] w-full">
                  {/* <!-- Card 1 --> */}
                  <div className="w-full p-2 bg-white  flex flex-col items-center gap-[8px]">
                    <div className="flex flex-col items-center gap-[4px]">
                      <img src={MissionVision} alt="" />
                      <div className="text-black text-[14px] md:text-[16px] font-hind-siliguri font-medium text-center">
                        {/* mission_vision h2 from API */}
                        {missionVision.title}
                      </div>
                    </div>
                    <button
                      onClick={() => handleModalOpen("mission")}
                      className="w-full h-[33px] px-[12px] py-[6px] rounded-[4px] outline outline-1 outline-black flex justify-center items-center gap-[10px] hover:bg-gray-50"
                    >
                      <div className="text-black text-[14px] md:text-[16px] font-hind-siliguri font-medium">
                        {/* Click on this will open mission_vision ul from API */} {" "}
                        বিস্তারিত
                      </div>
                    </button>
                  </div>

                  {/* <!-- Card 2 --> */}
                  <div className="w-full p-2 bg-white  flex flex-col items-center gap-[8px]">
                    <div className="flex flex-col items-center gap-[4px]">
                      <img src={Strategy} alt="" />
                      <div className="text-black text-[14px] md:text-[16px] font-hind-siliguri font-medium text-center">
                        {strategy.title}
                      </div>
                    </div>
                    <button
                      onClick={() => handleModalOpen("strategy")}
                      className="w-full h-[33px] px-[12px] py-[6px] rounded-[4px] outline outline-1 outline-black flex justify-center items-center gap-[10px] hover:bg-gray-50"
                    >
                      <div className="text-black text-[14px] md:text-[16px] font-hind-siliguri font-medium">
                        বিস্তারিত
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:gap-[24px] w-full">
                  {/* <!-- Card 3 --> */}
                  <div className="w-full p-2 bg-white  flex flex-col items-center gap-[8px]">
                    <div className="flex flex-col items-center gap-[4px]">
                      <img src={SuccessStory} alt="" />
                      <div className="text-black text-[14px] md:text-[16px] font-hind-siliguri font-medium text-center">
                        সফলতার গল্প
                      </div>
                    </div>
                    <button
                      onClick={() => handleModalOpen("success")}
                      className="w-full h-[33px] px-[12px] py-[6px] rounded-[4px] outline outline-1 outline-black flex justify-center items-center gap-[10px] hover:bg-gray-50"
                    >
                      <div className="text-black text-[14px] md:text-[16px] font-hind-siliguri font-medium">
                        বিস্তারিত
                      </div>
                    </button>
                  </div>

                  {/* <!-- Card 4 --> */}
                  <div className="w-full p-2 bg-white  flex flex-col items-center gap-[8px]">
                    <div className="flex flex-col items-center gap-[4px]">
                      <img src={Facilities} alt="" />
                      <div className="text-black text-[14px] md:text-[16px] font-hind-siliguri font-medium text-center">
                        {facilities.title}
                      </div>
                    </div>
                    <button
                      onClick={() => handleModalOpen("facilities")}
                      className="w-full h-[33px] px-[12px] py-[6px] rounded-[4px] outline outline-1 outline-black flex justify-center items-center gap-[10px] hover:bg-gray-50"
                    >
                      <div className="text-black text-[14px] md:text-[16px] font-hind-siliguri font-medium">
                        বিস্তারিত
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleModalClose}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold font-hind-siliguri">
                {modalContent.title}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              {modalContent.points.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#186D6D]">•</span>
                  <span className="text-gray-700 font-hind-siliguri">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default OurThoughts;
