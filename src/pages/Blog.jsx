import React, { useEffect, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import { fetchSiteSettings } from "../config/siteSettingsApi";

const POSTS_PER_PAGE = 3;

const Blog = () => {
  const data = useLoaderData();
  const posts = data.results || [];
  console.log("Blog Posts Data:", posts);
  

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
    const [buttonColor, setButtonColor] = useState('#FC5D43');
    
      // Fetch button color from site settings
      useEffect(() => {
        fetchSiteSettings()
          .then((data) => {
            if (data && data.button_color) {
              setButtonColor(data.button_color);
            }
          })
          .catch(() => {});
      }, []);

  // Helper to strip outer <p>...</p> tags
  const stripPTags = (html) => {
    if (!html) return '';
    // Remove only if it starts and ends with <p>...</p>
    return html.replace(/^<p>/i, '').replace(/<\/p>$/i, '');
  };

  return (
    <div className="container px-6 mx-auto py-8 lg:px-18 md:px-6 mt-4  xl:px-24">
      <h1 className="text-3xl font-bold text-center mb-8">Blog</h1>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {posts.slice(0, visiblePosts).map((post) => {
          const { day, month, year } = formatDate(post.created_at);
          const cleanContent = stripPTags(post.content);
          return (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg flex flex-row gap-6 mt-4"
              style={{ boxShadow: "0 0px 6px rgba(0,0,0,0.12)" }}
            >
              {/* Date section completely separated and centered vertically */}
              <div className="flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-4xl font-bold text-[#FC5D43] leading-none text-center">
                  {day}
                </span>
                <span className="text-xl font-medium text-[#FC5D43] text-center">
                  {month} {year.toString().slice(2)}
                </span>
              </div>
              {/* Content section to the right */}
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-700 mt-4">
                  {cleanContent.length > 180
                    ? cleanContent.slice(0, 180) + "..."
                    : cleanContent}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="mt-4 inline-block font-bold"
                >
                  Read more
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      {visiblePosts < posts.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={showMorePosts}
            className=" font-bold py-2 px-4 rounded"
            style={{ backgroundColor: buttonColor}}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
