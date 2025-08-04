import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { Api_Base_Url, Site_Id } from "../config/api";
import { fetchSiteSettings } from "../config/siteSettingsApi";

const GoogleReviewSkeleton = () => {
  return (
    <div className="md:p-8 relative overflow-hidden">
      {/* Left Side Decorative SVG */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="108" height="100%" viewBox="0 0 108 1553" fill="none" className="min-h-full">
          <path d="M59.3578 0.108979C56.6367 87.8331 106.105 171.244 107.015 257.736C107.924 344.227 60.2746 433.8 55.4105 514.894C50.5464 595.988 36.2761 672.916 42.6007 753.386C48.9253 833.856 75.8438 917.866 80.1674 997.061C84.4909 1076.26 66.2205 1150.63 57.1142 1250.72C48.008 1350.8 48.068 1476.59 50.5539 1524.77C53.0398 1572.96 57.9516 1543.56 62.9335 1544.43L-1136.63 1516.93L-1140.13 2.88623L59.3578 0.108979Z" fill="url(#paint0_linear_383_1782)" />
          <defs>
            <linearGradient id="paint0_linear_383_1782" x1="298.469" y1="-162.766" x2="-1809.29" y2="-157.886" gradientUnits="userSpaceOnUse">
              <stop offset="0.05" stopColor="#f50000" stopOpacity="0.5" />
              <stop offset="0.95" stopColor="#f0f0f0" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right Side Decorative SVG */}
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="112" height="100%" viewBox="0 0 112 1554" fill="none" className="min-h-full">
          <path d="M48.5347 0.108979C51.2557 87.8896 1.78707 171.354 0.877464 257.902C-0.0321373 344.449 47.6173 434.08 52.4813 515.226C57.3453 596.372 71.6154 673.35 65.2907 753.871C58.966 834.393 32.0474 918.458 27.7237 997.703C23.4001 1076.95 41.6704 1151.38 50.7765 1251.52C59.8826 1351.67 59.8224 1477.54 57.3364 1525.76C54.8505 1573.98 49.9387 1544.55 44.9568 1545.42L1244.52 1517.9L1248.02 2.88623L48.5347 0.108979Z" fill="url(#paint1_linear_383_1781)" />
          <defs>
            <linearGradient id="paint1_linear_383_1781" x1="-190.576" y1="-162.871" x2="1917.18" y2="-157.99" gradientUnits="userSpaceOnUse">
              <stop offset="0.05" stopColor="#f50000" stopOpacity="0.5" />
              <stop offset="0.95" stopColor="#f0f0f0" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content Container with max-width */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4">
        <div className="lg:pl-10 lg:ml-6 lg:pr-10 lg:mr-6">
          {/* Google Review Card Skeleton */}
          <div className="bg-white rounded-lg p-6 border-gray-100 max-w-md animate-pulse">
            {/* Logo and Title Skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 bg-gray-300 rounded shimmer"></div>
              <div className="h-6 bg-gray-300 rounded w-48 shimmer"></div>
            </div>

            {/* Rating Section Skeleton */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 bg-gray-300 rounded shimmer"></div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-6 h-6 bg-gray-300 rounded shimmer"></div>
                  ))}
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-32 mb-1 shimmer"></div>
              <div className="h-4 bg-gray-300 rounded w-24 shimmer"></div>
            </div>

            {/* Review Button Skeleton */}
            <div className="w-full h-12 bg-gray-300 rounded-lg shimmer"></div>
          </div>

          {/* Review Items Skeleton */}
          <div className="mt-6 md:mt-8 space-y-4 md:space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4 md:p-6 border border-gray-100 shadow-sm animate-pulse">
                <div className="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  {/* User Info and Rating Skeleton */}
                  <div className="flex justify-start items-center gap-2 md:gap-3">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-300 rounded-full shimmer"></div>
                    <div className="inline-flex flex-col justify-start items-start gap-1">
                      <div className="h-5 bg-gray-300 rounded w-24 shimmer"></div>
                      <div className="inline-flex justify-start items-center gap-2">
                        <div className="h-4 bg-gray-300 rounded w-8 shimmer"></div>
                        <div className="flex justify-start items-start gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded shimmer"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Posted Time Skeleton */}
                  <div className="h-4 bg-gray-300 rounded w-20 shimmer"></div>
                </div>
                {/* Review Comment Skeleton */}
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full shimmer"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 shimmer"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


const GoogleReview = ({ courseId, reviewsData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [, setFirebaseConfig] = useState(null);
  const [authInstance, setAuthInstance] = useState(null);
  const [loading, setLoading] = useState(true);

  const [, setButtonColor] = useState("#FC5D43");
  const [primaryColor, setPrimaryColor] = useState("#f50000"); // fallback
  const [secondaryColor, setSecondaryColor] = useState("#f0f0f0"); // fallback
  const [siteLogo, setSiteLogo] = useState(null);
  const [siteName, setSiteName] = useState("আমাদের শিক্ষা কম্পিউটার ট্রেনিং সেন্টার");

  // Use reviewsData from props, but allow refresh after submit
  const [reviewList, setReviewList] = useState(
    reviewsData && (Array.isArray(reviewsData.results) ? reviewsData.results : Array.isArray(reviewsData) ? reviewsData : [])
  );
  const averageRating = reviewList && reviewList.length > 0 ? (reviewList.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewList.length).toFixed(1) : null;
  const reviewCount = reviewList ? reviewList.length : 0;




  // Fetch site settings directly (no caching)
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data) {
          if (data.button_color) setButtonColor(data.button_color);
          if (data.primary_color) setPrimaryColor(data.primary_color);
          if (data.secondary_color) setSecondaryColor(data.secondary_color);
          if (data.logo) setSiteLogo(data.logo);
          if (data.site_name) setSiteName(data.site_name);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch site settings:", err);
      });
  }, []);


  // Update reviewList if reviewsData prop changes (e.g., on route change)
  useEffect(() => {
    setReviewList(
      reviewsData && (Array.isArray(reviewsData.results) ? reviewsData.results : Array.isArray(reviewsData) ? reviewsData : [])
    );
  }, [reviewsData]);

  // Fetch Firebase config from backend and initialize Firebase
  useEffect(() => {
    const fetchFirebaseConfig = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch(`${Api_Base_Url}/firebase-config`, {
          headers: {
            "Site-Id": Site_Id,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch Firebase config");
        const config = await response.json();
        setFirebaseConfig(config);
        const app = initializeApp(config);
        setAuthInstance(getAuth(app));
        setLoading(false);
      } catch (err) {
        setError(err.message || "Could not fetch Firebase config.");
        console.error("Error fetching Firebase config:", err);
        setLoading(false);
      }
    };
    fetchFirebaseConfig();
  }, []);

  const provider = new GoogleAuthProvider();

  const handleReviewButton = async () => {
    if (!authInstance) {
      setError("Firebase authentication is not ready. Please try again later.");
      return;
    }
    try {
      setError("");
      const result = await signInWithPopup(authInstance, provider);
      setUser(result.user);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Google Sign In Error:", error);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment) return;

    // Backend expects: course, rating, feedback, name, user_img, email
    const payload = {
      course: courseId,
      rating,
      feedback: comment,
      name: user.displayName,
      user_img: user.photoURL,
      email: user.email,
      site_id: Site_Id,
    };

    try {
      setError("");
      const res = await fetch(`${Api_Base_Url}/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Site-Id": Site_Id,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let errorMsg = "Failed to submit review. Please check your input.";
        try {
          const errData = await res.json();
          if (errData && typeof errData === 'object') {
            // If backend returns a detail or non_field_errors or field errors
            if (errData.detail) errorMsg = errData.detail;
            else if (errData.non_field_errors && Array.isArray(errData.non_field_errors)) errorMsg = errData.non_field_errors.join(' ');
            else if (Object.keys(errData).length > 0) errorMsg = Object.entries(errData).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`).join(' ');
          }
        } catch { }
        setError(errorMsg);
        return;
      }
      // Refetch reviews after successful post
      try {
        const res2 = await fetch(`${Api_Base_Url}/reviews/?course=${courseId}&site_id=${Site_Id}`, {
          headers: { "Site-Id": Site_Id },
        });
        if (res2.ok) {
          const data = await res2.json();
          setReviewList(Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : []);
        }
      } catch { }
      setIsModalOpen(false);
      setRating(0);
      setComment("");
    } catch (e) {
      setError("Failed to submit review. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRating(0);
    setComment("");
    setError("");
  };

  // Show shimmer skeleton while loading
  if (loading) {
    return <GoogleReviewSkeleton />;
  }

  return (
    <div className="md:p-8 relative overflow-hidden">
      {/* Left Side Decorative SVG */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="108" height="100%" viewBox="0 0 108 1553" fill="none" className="min-h-full">
          <path d="M59.3578 0.108979C56.6367 87.8331 106.105 171.244 107.015 257.736C107.924 344.227 60.2746 433.8 55.4105 514.894C50.5464 595.988 36.2761 672.916 42.6007 753.386C48.9253 833.856 75.8438 917.866 80.1674 997.061C84.4909 1076.26 66.2205 1150.63 57.1142 1250.72C48.008 1350.8 48.068 1476.59 50.5539 1524.77C53.0398 1572.96 57.9516 1543.56 62.9335 1544.43L-1136.63 1516.93L-1140.13 2.88623L59.3578 0.108979Z" fill="url(#paint0_linear_383_1782)" />
          <defs>
            <linearGradient id="paint0_linear_383_1782" x1="298.469" y1="-162.766" x2="-1809.29" y2="-157.886" gradientUnits="userSpaceOnUse">
              <stop offset="0.05" stopColor={primaryColor} stopOpacity="0.5" />
              <stop offset="0.95" stopColor={secondaryColor} stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right Side Decorative SVG */}
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="112" height="100%" viewBox="0 0 112 1554" fill="none" className="min-h-full">
          <path d="M48.5347 0.108979C51.2557 87.8896 1.78707 171.354 0.877464 257.902C-0.0321373 344.449 47.6173 434.08 52.4813 515.226C57.3453 596.372 71.6154 673.35 65.2907 753.871C58.966 834.393 32.0474 918.458 27.7237 997.703C23.4001 1076.95 41.6704 1151.38 50.7765 1251.52C59.8826 1351.67 59.8224 1477.54 57.3364 1525.76C54.8505 1573.98 49.9387 1544.55 44.9568 1545.42L1244.52 1517.9L1248.02 2.88623L48.5347 0.108979Z" fill="url(#paint1_linear_383_1781)" />
          <defs>
            <linearGradient id="paint1_linear_383_1781" x1="-190.576" y1="-162.871" x2="1917.18" y2="-157.99" gradientUnits="userSpaceOnUse">
              <stop offset="0.05" stopColor={primaryColor} stopOpacity="0.5" />
              <stop offset="0.95" stopColor={secondaryColor} stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content Container with max-width */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4">
        {/* Content Wrapper with better positioning */}
        <div className="lg:pl-10 lg:ml-6 lg:pr-10 lg:mr-6">
          {/* Google Review Card */}
          <div className="bg-white rounded-lg p-6 border-gray-100 max-w-md">
            {/* Logo and Title */}
            {/* <div className="flex items-center gap-3 mb-4">
              <img src={siteLogo || "/pfp.jpg"} alt="Company Logo" className="h-12 w-12" />
              <h2 className="text-lg font-semibold font-['Hind_Siliguri'] text-gray-800">
                {siteName}
              </h2>
            </div> */}

            {/* Rating Section */}
            {/* <div className="mb-4"> */}
              {/* Rating Score and Stars */}
              {/* <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-800">{averageRating ?? '--'}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" fill={star <= Math.round(averageRating) ? "#FF9900" : "#606060"} />
                    </svg>
                  ))}
                </div>
              </div> */}
              {/* Review Count */}
              {/* <p className="text-gray-600 text-sm mb-1">{reviewCount > 0 ? `Based on ${reviewCount} review${reviewCount > 1 ? 's' : ''}` : 'No reviews yet'}</p> */}
              {/* Powered by Google */}
              {/* <p className="text-gray-500 text-sm">
                powered by <span className="text-blue-600 font-medium">Google</span>
              </p>
            </div> */}

            {/* Review Button */}
            <button
              className="w-full px-6 py-3 bg-[#4285F4] text-white rounded-lg hover:bg-blue-600 font-['Hind_Siliguri'] flex items-center justify-center gap-2"
              onClick={handleReviewButton}
            >
              <span>review us on</span>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Review Modal */}
          {isModalOpen && user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
              <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold font-['Hind_Siliguri']">
                    Write a Review
                  </h2>
                  <button
                    onClick={handleCloseModal}
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

                {/* User Info */}
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <img
                    src={user.photoURL || "/pfp.jpg"}
                    alt={user.displayName}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/pfp.jpg";
                    }}
                  />
                  <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="text-zinc-900 text-lg md:text-xl font-semibold font-['Hind_Siliguri']">
                      {user.displayName}
                    </div>
                    <div className="text-zinc-600 text-sm md:text-base font-normal font-['Hind_Siliguri']">
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-4 md:mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="w-6 h-6 relative"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={star <= rating ? "#F59E0B" : "#E5E7EB"}
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  ))}
                </div>

                {/* Review Text */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full p-3 md:p-4 border rounded-lg mb-4 md:mb-6 h-32 text-base md:text-lg font-normal font-['Hind_Siliguri'] text-zinc-900"
                />

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || !comment.trim()}
                  className={`w-full py-3 rounded-lg font-['Hind_Siliguri'] text-base md:text-lg ${rating === 0 || !comment.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#186D6D] hover:bg-[#145757] text-white"
                    }`}
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {/* Display Reviews */}
          <div className="mt-6 md:mt-8 space-y-4 md:space-y-6">
            {reviewList && reviewList.map((review) => {
              // Support both {user: {name, photoURL, email}} and {name, user_img, email}
              const userName = review.user?.name || review.name || review.user_name || review.student_name || "";
              // Use user_img or user.photoURL only if present, do not use default/fallback
              let userImg = null;
              if (review.user_img) {
                userImg = review.user_img;
              } else if (review.user && review.user.photoURL) {
                userImg = review.user.photoURL;
              } else {
                userImg = null;
              }
              const reviewText = review.comment || review.feedback || review.text || review.description || "";
              const rating = typeof review.rating === 'number' ? review.rating : 0;
              return (
                <div
                  key={review.id}
                  className="bg-white rounded-lg p-4 md:p-6 border border-gray-100 shadow-sm"
                >
                  <div className="w-full flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    {/* User Info and Rating */}
                    <div className="flex justify-start items-center gap-2 md:gap-3">
                      <img
                        src={userImg || "/pfp.jpg"}
                        alt={userName}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/pfp.jpg";
                        }}
                      />
                      <div className="inline-flex flex-col justify-start items-start gap-1">
                        <div className="text-zinc-900 text-lg md:text-xl font-semibold font-['Hind_Siliguri']">
                          {userName}
                        </div>
                        <div className="inline-flex justify-start items-center gap-2">
                          <div className="text-black text-base md:text-lg font-medium font-['Hind_Siliguri']">
                            {rating.toFixed(1)}
                          </div>
                          <div className="flex justify-start items-start gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={i < rating ? "#F59E0B" : "#E5E7EB"}
                                className="w-4 h-4 md:w-5 md:h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Posted Time - Better positioned */}
                    <div className="text-zinc-600 text-sm md:text-base font-normal font-['Hind_Siliguri'] md:text-right flex-shrink-0">
                      Posted {review.created_at ? new Date(review.created_at).toLocaleDateString() : (review.timestamp ? new Date(review.timestamp).toLocaleDateString() : "")}
                    </div>
                  </div>
                  {/* Review Comment */}
                  <div className="mt-4 text-zinc-900 text-base md:text-lg font-normal font-['Hind_Siliguri']">
                    {reviewText}
                  </div>
                </div>
              );
            })}
          </div>
        </div> {/* Close content wrapper */}
      </div> {/* Close content container */}
    </div>
  );
};

export default GoogleReview;
