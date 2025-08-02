import React from "react";
import { Link } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const ErrorPage = () => (
  <section className="py-10 bg-white font-serif min-h-screen flex items-center">
    <div className="container mx-auto px-4">
      <div className="flex justify-center">
        <div className="w-full max-w-6xl text-center">
          <h1 className="text-8xl font-bold text-center">404</h1>
          <div
            className="h-96 bg-center bg-no-repeat flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
            }}
          >
            
          </div>

          {/* <DotLottieReact
            src="https://lottie.host/5c50c507-e577-425d-9c1e-b295f87be535/Pm6YCrI0Zo.lottie"
            loop
            autoplay
          /> */}
          <div className="mt-[-50px] pt-4">
            <h3 className="text-2xl font-bold mb-2">Look like you're lost</h3>
            <p className="mb-6">The page you are looking for is not available!</p>
           
           
            <Link
              to="/"
              className="text-white bg-green-600 px-5 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ErrorPage;
