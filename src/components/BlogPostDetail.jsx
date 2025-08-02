import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";

const BlogPostDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-[80px] pt-20 pb-[226px]">
      {/* Image Skeleton */}
      <div className="w-full h-64 sm:h-72 md:h-96 bg-gray-300 rounded-lg mb-8 shimmer animate-pulse"></div>

      {/* Title Skeleton */}
      <div className="mb-6">
        <div className="h-8 sm:h-10 md:h-12 bg-gray-300 rounded w-3/4 mb-2 shimmer animate-pulse"></div>
        <div className="h-6 sm:h-8 md:h-10 bg-gray-300 rounded w-1/2 shimmer animate-pulse"></div>
      </div>

      {/* Date Section Skeleton */}
      <div className="flex items-center mb-6">
        <div className="flex flex-col items-center justify-center min-w-[60px] mr-4">
          <div className="h-6 sm:h-8 md:h-10 bg-gray-300 rounded w-20 shimmer animate-pulse"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-3">
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-full shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-5/6 shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-4/5 shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-full shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-3/4 shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-5/6 shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-2/3 shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-4/5 shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-full shimmer animate-pulse"></div>
        <div className="h-4 sm:h-5 bg-gray-300 rounded w-3/5 shimmer animate-pulse"></div>
      </div>
    </div>
  );
};

const BlogPostDetail = () => {
  const post = useLoaderData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for shimmer effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <BlogPostDetailSkeleton />;
  }

  if (!post) return null;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return { day, month, year };
  };

  const { day, month, year } = formatDate(post.created_at);

  return (
    <div
      className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-[80px] pt-20 pb-[226px]"
    >
      {/* Image */}
      {post.featured_image && (
        <img
          src={post.featured_image}
          alt="Blog Thumbnail"
          className="w-full h-64 sm:h-72 md:h-96 rounded-lg mb-8 object-cover"
        />
      )}

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
        {post.title}
      </h1>

      {/* Date section */}
      <div className="flex items-center mb-6">
        <div className="flex flex-col items-center justify-center min-w-[60px] mr-4">
          <span className="text-base sm:text-lg md:text-3xl font-medium text-[#FC5D43] leading-none">
            {day} {month}, {year.toString().slice(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
        {(() => {
          // Helper to strip outer <p>...</p> tags
          const stripPTags = (html) => {
            if (!html) return '';
            return html.replace(/^<p>/i, '').replace(/<\/p>$/i, '');
          };
          const cleanContent = stripPTags(post.content);
          return <span dangerouslySetInnerHTML={{ __html: cleanContent }} />;
        })()}
      </div>
    </div>
  );
};

export default BlogPostDetail;
