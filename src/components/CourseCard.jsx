import React from "react";
import { Link } from "react-router-dom";
import Button from "./sharedComponents/Button";

const CourseCard = ({
  imageSrc,
  title,
  rating,
  reviewCount,
  instructorName,
  instructorTitle,
  price,
  duration,
  description,
  pdfUrl,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
      {/* Image Placeholder */}
      <img className="w-full" src={imageSrc} alt={title} />

      <div className="px-6 py-4">
        {/* Course Title */}
        <div className="font-bold text-xl mb-2">{title}</div>

        {/* Rating and Reviews */}
        <div className="flex items-center mb-2 text-gray-700 text-base">
          <span className="text-yellow-500 mr-1">★</span>
          {rating} ({reviewCount} রিভিউ)
        </div>

        {/* Instructor Info */}
        <div className="flex items-center mb-2">
          {/* Instructor Image Placeholder */}
          {/* <img className="w-8 h-8 rounded-full mr-4" src={instructorImageSrc} alt={instructorName} /> */}
          <div className="text-sm">
            <p className="text-gray-900 leading-none">{instructorName}</p>
            <p className="text-gray-600">{instructorTitle}</p>
          </div>
        </div>

        {/* Price and Duration */}
        <div className="flex items-center mb-2 text-gray-700 text-base">
          <span className="mr-4">কোর্স ফি: {price} টাকা</span>
          <span>সময়কাল: {duration}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-base mb-4">{description}</p>

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <a
            href={pdfUrl}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            পিডিএফ ডাউনলোড করুন।
          </a>
          <Link to="/admission">
            <Button>রেজিস্ট্রেশন করুন</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
