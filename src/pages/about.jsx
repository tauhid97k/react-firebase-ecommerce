import { FaLeaf, FaHistory, FaAward } from "react-icons/fa";
import { MdOutlinePersonPin } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";

const AboutPage = () => {
  return (
    <div className="bg-white">
      <div className="max-w-5xl px-4 xl:px-0 py-10 lg:py-20 mx-auto">
        {/* Hero Section */}
        <div className="max-w-3xl flex flex-col items-center justify-center mb-12 lg:mb-16 text-center">
          <h2 className="text-gray-900 font-semibold text-2xl md:text-4xl md:leading-tight">
            About Our Story
          </h2>
          <p className="mt-3 text-gray-600">
            We're passionate about bringing pure, natural products directly to
            your doorstep
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="bg-yellow-100 rounded-lg h-64 md:h-auto relative overflow-hidden">
            <img src="/companylogo.png" alt="Company Logo" />
          </div>

          {/* Right Column - Story */}
          <div className="flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              Our Journey Begins
            </h3>
            <p className="text-gray-600 mb-4">
              Launched just a month ago, our journey has only just begun — but
              our vision is clear: to offer high-quality, natural products that
              make a real difference in people’s lives.
            </p>
            <p className="text-gray-600">
              We're passionate about sustainability, quality, and building
              strong relationships with local producers. Every item we offer is
              thoughtfully chosen to reflect our commitment to freshness, trust,
              and positive impact — from the very start.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 text-center">
            Our Core Values
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                <FaLeaf className="text-yellow-500 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-center mb-2">
                Sustainability
              </h4>
              <p className="text-gray-600 text-sm text-center">
                We're committed to environmentally friendly practices in every
                aspect of our business, from sourcing to packaging.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                <FaAward className="text-yellow-500 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-center mb-2">
                Quality
              </h4>
              <p className="text-gray-600 text-sm text-center">
                We never compromise on quality, ensuring every product meets our
                rigorous standards before reaching your home.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                <IoMdPeople className="text-yellow-500 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-center mb-2">
                Community
              </h4>
              <p className="text-gray-600 text-sm text-center">
                We support local farmers and producers, creating sustainable
                livelihoods and stronger communities.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            Join Our Journey
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Experience the difference of our premium natural products and become
            part of our growing community.
          </p>
          <button className="inline-flex items-center gap-x-2 py-3 px-6 bg-yellow-400 font-medium text-gray-800 rounded-full hover:bg-yellow-300 transition">
            Shop Now
            <svg
              className="shrink-0 w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
