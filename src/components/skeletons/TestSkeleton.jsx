import React from "react";
import CourseSkeleton from "./CourseSkeleton";
import HeroSkeleton from "./HeroSkeleton";
import NavbarSkeleton from "./NavbarSkeleton";

const TestSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center py-4">
        Skeleton Loading Test
      </h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Hero Skeleton</h2>
          <HeroSkeleton />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Navbar Skeleton</h2>
          <NavbarSkeleton />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Course Skeleton</h2>
          <CourseSkeleton />
        </div>
      </div>
    </div>
  );
};

export default TestSkeleton;
