import { createBrowserRouter } from "react-router-dom";
import AdmissionForm from "../components/AdmissionForm";
import BlogPostDetail from "../components/BlogPostDetail";
import PhotoGallery from "../components/Gallery/PhotoGallery";
import VideoGallery from "../components/Gallery/VideoGallery";
import LoginForm from "../components/LoginForm";
import OurOpinion from "../components/OurOpinion";
import OurWork from "../components/OurWork";
import { Api_Base_Url, Site_Id } from "../config//api";
import Root from "../layout/Root";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import Course from "../pages/Course";
import CourseDetails from "../pages/CourseDetails";
import Games from "../pages/Games";
import Home from "../pages/Home";
import SuccessStories from "../pages/SuccessStories";
import Training from "../pages/Trainer";
import TrainerDetails from "../pages/TrainerDetails";
import ErrorPage from "../Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home></Home> },
      {
        path: "/login",
        element: <LoginForm></LoginForm>,
      },
      {
        path: "/course",
        element: <Course></Course>,
        loader: () =>
          fetch(`${Api_Base_Url}/courses/?page_size=100`, {
            headers: {
              "Site-Id": Site_Id,
            },
          }).then((res) => res.json()),
      },
      {
        path: "/course/:id",
        element: <CourseDetails></CourseDetails>,
        loader: async ({ params }) => {
          try {
            const response = await fetch(`${Api_Base_Url}/courses/${params.id}/`, {
              headers: {
                "Site-Id": Site_Id,
              },
            });
            
            if (!response.ok) {
              throw new Error('Course not found');
            }
            
            const courseData = await response.json();
            console.log("Course details from API:", courseData);

            // Always fetch reviews for the course
            try {
              const reviewsResponse = await fetch(`${Api_Base_Url}/reviews/?course=${courseData.id}`, {
                headers: {
                  "Site-Id": Site_Id,
                },
              });
              if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                courseData.reviews = reviewsData;
                console.log("Reviews data fetched for course", courseData.id, reviewsData);
              } else {
                console.warn("Failed to fetch reviews for course", courseData.id, reviewsResponse.status);
              }
            } catch (error) {
              console.error("Error fetching reviews for course", courseData.id, error);
            }

            // If course has instructor_id, fetch instructor details
            if (courseData.instructor_id) {
              try {
                const instructorResponse = await fetch(`${Api_Base_Url}/instructors/${courseData.instructor_id}/`, {
                  headers: {
                    "Site-Id": Site_Id,
                  },
                });
                
                if (instructorResponse.ok) {
                  const instructorData = await instructorResponse.json();
                  courseData.instructor = instructorData;
                  console.log("Instructor data fetched:", instructorData);
                }
              } catch (instructorError) {
                console.error("Error fetching instructor:", instructorError);
              }
            }
            
            return courseData;
          } catch (error) {
            console.error("Error fetching course:", error);
            throw error;
          }
        },
      },
      {
        path: "/training",
        element: <Training></Training>,
        loader: () =>
          fetch(`${Api_Base_Url}/instructors/`, {
            headers: {
              "Site-Id": Site_Id,
            },
          }),
      },
      {
        path: "/games",
        element: <Games></Games>,
      },
      {
        path: "/photosGallery",
        element: <OurWork></OurWork>,
      },
      {
        path: "/blog",
        element: <Blog></Blog>,
        loader: () =>
          fetch(`${Api_Base_Url}/blogs/`, {
            headers: {
              "Site-Id": Site_Id,
            },
          }),
      },
      {
        path: "/blog/:id",
        element: <BlogPostDetail></BlogPostDetail>,
        loader: ({ params }) =>
          fetch(`${Api_Base_Url}/blogs/${params.id}/`, {
            headers: {
              "Site-Id": Site_Id,
            },
          }).then((res) => res.json()),
      },
      {
        path: "/contact",
        element: <Contact></Contact>,
      },
      {
        path: "/admission",
        element: <AdmissionForm></AdmissionForm>,
      },
      {
        path: "/photoGallery",
        element: <PhotoGallery></PhotoGallery>,
      },
      {
        path: "/videoGallery",
        element: <VideoGallery></VideoGallery>,
        loader: async () => {
          try {
            const response = await fetch(`${Api_Base_Url}/video-galleries`, {
              headers: {
                "Site-Id": Site_Id,
                Accept: "application/json",
              },
            });
            if (!response.ok) {
              throw new Error('Failed to fetch video galleries');
            }
            const data = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching video galleries:", error);
            return { results: [] };
          }
        },
      },
      {
        path: "/success-stories",
        element: <SuccessStories></SuccessStories>,
      },
      {
        path: "/OurOpinion",
        element: <OurOpinion></OurOpinion>,
      },
      {
        path: "/trainer/:id",
        element: <TrainerDetails />,
      },
    ],
  },
]);
