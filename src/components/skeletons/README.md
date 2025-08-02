# Skeleton Loading Components

This directory contains skeleton loading components that provide a better user experience during data fetching.

## Components

### HeroSkeleton.jsx
- Skeleton for the Hero section
- Shows placeholder for title, subtitle, button, image, and banner cards
- Matches the exact structure of the Hero component

### NavbarSkeleton.jsx
- Skeleton for the navigation bar
- Shows placeholder for logo, menu items, and contact button
- Responsive design matching the actual navbar

### CourseSkeleton.jsx
- Skeleton for the course section
- Shows placeholder for course cards with images, titles, ratings, and buttons
- Includes navigation arrows and "View More" button

## Usage

The skeleton components are automatically used when the respective components are in a loading state:

1. **Hero Component**: Shows `HeroSkeleton` when banner data is loading
2. **Navbar Component**: Shows `NavbarSkeleton` when site settings are loading
3. **OurCourses Component**: Shows `CourseSkeleton` when course data is loading

## Dependencies

- `react-loading-skeleton`: For creating skeleton loading animations
- `react-content-loader`: Alternative skeleton library (installed but not used in current implementation)

## Customization

You can customize the skeleton appearance by modifying:
- `baseColor`: The base color of the skeleton
- `highlightColor`: The highlight color for the animation
- `height` and `width`: Dimensions of skeleton elements
- `count`: Number of skeleton lines for text

## Example

```jsx
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Basic skeleton
<Skeleton height={20} width={100} />

// Circle skeleton for images
<Skeleton height={60} width={60} circle />

// Multiple lines for text
<Skeleton height={16} width="80%" count={3} />
``` 