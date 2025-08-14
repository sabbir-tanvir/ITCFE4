import React, { useEffect, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import { fetchSiteSettings } from "../config/siteSettingsApi";

const POSTS_PER_PAGE = 3;

const Blog = () => {
  const data = useLoaderData();
  const posts = data.results || [];


  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);

  const showMorePosts = () => {
    setVisiblePosts((prev) => prev + POSTS_PER_PAGE);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return { day, month, year };
  };
  const [buttonColor, setButtonColor] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');


  // Fetch button color from site settings
  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        if (data && data.button_color) {
          setButtonColor(data.button_color);
          setPrimaryColor(data.primary_color);

        }
      })
      .catch(() => { });
  }, []);

  // Helper to strip ALL html tags & decode entities safely
  const extractPlainText = (html) => {
    if (!html) return '';
    // Use DOMParser for safer decoding; fallback to regex removal if DOMParser unavailable
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    } catch {
      return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
  };

  return (
    <div className="container px-6 mx-auto py-8 lg:px-14 md:px-6  xl:px-24">
      <h1 className="text-3xl font-bold text-center mb-8">ব্লগ</h1>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {posts.length === 0 && (
          // Dummy fallback structure when no real blog posts are available
          <div
            className="bg-white p-6 rounded-lg flex flex-row gap-6 mt-4 animate-[fadeIn_0.4s_ease]"
            style={{ boxShadow: "0 0px 6px rgba(0,0,0,0.12)" }}
          >
            <div className="flex flex-col items-center justify-center min-w-[80px]">
              <span className="text-4xl font-bold leading-none text-center" style={{ color: primaryColor }}>01</span>
              <span className="text-xl font-medium text-center" style={{ color: primaryColor }}>Jan 25</span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-xl font-semibold mb-2">ডেমো ব্লগ শিরোনাম</h2>
              <p className="text-gray-700">
                আপাতত কোনও ব্লগ পাওয়া যায়নি। শীঘ্রই নতুন কনটেন্ট যোগ হবে। এই অংশটি একটি ডেমো কাঠামো যাতে পেজটি ফাঁকা না দেখায়।
              </p>
              <span className="mt-4 inline-block font-bold text-gray-400 cursor-not-allowed select-none">Read more</span>
            </div>
          </div>
        )}
        {posts.length > 0 && posts.slice(0, visiblePosts).map((post) => {
          const { day, month, year } = formatDate(post.created_at);
          const cleanContent = extractPlainText(post.content);
          return (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg flex flex-row gap-6 mt-4"
              style={{ boxShadow: "0 0px 6px rgba(0,0,0,0.12)" }}
            >
              <div className="flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-4xl font-bold leading-none text-center" style={{ color: primaryColor }}>{day}</span>
                <span className="text-xl font-medium text-center" style={{ color: primaryColor }}>{month} {year.toString().slice(2)}</span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-700 mt-4">
                  {cleanContent.length > 180 ? cleanContent.slice(0, 180) + "..." : cleanContent}
                </p>
                <Link to={`/blog/${post.id}`} className="mt-4 inline-block font-bold">Read more</Link>
              </div>
            </div>
          );
        })}
      </div>
      {visiblePosts < posts.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={showMorePosts}
            className="text-white font-bold py-2 px-4 rounded"
            style={{ backgroundColor: buttonColor }}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
