import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function Hero({ hero }) {
  const [bgImage, setBgImage] = useState("/hero.jpg");
  
  // Log hero data for debugging
  console.log("Hero data from prop:", hero);
  
  // Default values if hero data is not available
  const heroTitle = hero?.hero_title || "Data to enrich your online business";
  const heroDescription = hero?.hero_description || "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui";
  
  // Handle background image with error handling
  useEffect(() => {
    if (hero?.hero_bg) {
      // Create a new image to test if the URL is valid
      const img = new Image();
      img.onload = () => {
        // Image loaded successfully, use it
        setBgImage(hero.hero_bg);
      };
      img.onerror = () => {
        // Error loading image, use default
        console.error("Error loading hero background image, using default");
        setBgImage("/hero.jpg");
      };
      img.src = hero.hero_bg;
    } else {
      // No hero background, use default
      setBgImage("/hero.jpg");
    }
  }, [hero]);

  return (
    <div
      className="relative px-6 pt-14 lg:px-8"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto max-w-2xl py-8 lg:py-28">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            {heroTitle}
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {heroDescription}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="#"
              className="rounded-md bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
