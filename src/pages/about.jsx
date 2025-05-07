import { FaLeaf, FaAward } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";

const AboutPage = () => {
  return (
    <div className="bg-white">
      <div className="max-w-5xl px-4 xl:px-0 py-10 lg:py-20 mx-auto">
        {/* Hero Section */}
        <div className="max-w-3xl flex flex-col items-center justify-center mb-12 lg:mb-16 text-center">
          <h2 className="text-gray-900 font-semibold text-2xl md:text-4xl md:leading-tight">
            About Us : Khujenin
          </h2>
          <p className="mt-3 text-gray-600">
            Khujenin এমন একটি প্ল্যাটফর্ম যেখানে আপনি হোমমেড ফুডসহ যেকোন ফুড
            আইটেম কেনাবেচা করতে পারবেন!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="bg-yellow-100 rounded-lg h-64 md:h-auto relative overflow-hidden flex items-center justify-center">
            <img
              src="/companylogo.png"
              alt="Company Logo"
              className="object-contain h-full w-full"
            />
          </div>

          {/* Right Column - Story */}
          <div className="flex flex-col justify-center">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              বিক্রি করতে চান?
            </h3>
            <p className="text-gray-600 mb-4">
              আপনার ফুড আইটেম পণ্য বিক্রি করতে বিনামূল্যে বিজ্ঞাপন পোস্ট করুন।
              দ্রুত আপলোড হয়ে যাবে। আপনার যদি বিক্রির জন্য অনেক পণ্য থাকে তাহলে{" "}
              <strong>মেম্বারশিপ</strong> নিন এবং দারুন কিছু সুবিধা উপভোগ করুন।
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              কিছু কিনতে চান?
            </h3>
            <p className="text-gray-600">
              Khujenin এ রয়েছে সারা বাংলাদেশ থেকে বিখ্যাত সব ফুড পণ্যের কালেকশন।
              হোমমেড ফুড থেকে শুরু করে আচার, মিষ্টি, দই, রসমালাই, ফুড
              সাপ্লিমেন্টারী সহ এমনকি আপনার কাঙ্খিত শখের চিড়ার মোয়াটিও খুঁজে
              পাবেন।
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 text-center">
            আমরা যেটাতে বিশ্বাস করি
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                <FaLeaf className="text-yellow-500 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-center mb-2">
                টেকসই মানসিকতা
              </h4>
              <p className="text-gray-600 text-sm text-center">
                পরিবেশবান্ধব নীতিতে আমাদের প্ল্যাটফর্ম পরিচালিত হয়, যাতে
                প্রত্যেকটি পণ্য পরিবেশের জন্য নিরাপদ হয়।
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                <FaAward className="text-yellow-500 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-center mb-2">
                গুণগত মান
              </h4>
              <p className="text-gray-600 text-sm text-center">
                প্রতিটি পণ্যের মান যাচাই করে তারপরই প্ল্যাটফর্মে প্রদর্শন করা
                হয়, যাতে আপনি সেরা মানের পণ্য পান।
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4 mx-auto">
                <IoMdPeople className="text-yellow-500 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-center mb-2">
                কমিউনিটি
              </h4>
              <p className="text-gray-600 text-sm text-center">
                আমরা স্থানীয় উদ্যোক্তাদের সহযোগিতা করি, যাতে তারা তাদের পণ্য
                আরও সহজে বিক্রি করতে পারেন।
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
            আসুন, আমাদের যাত্রায় যোগ দিন!
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Khujenin-এ আপনার অভিজ্ঞতাকে আরও উপভোগ্য করতে আমরা প্রতিটি বিজ্ঞাপন
            ম্যানুয়ালি যাচাই করি, যাতে ক্রেতা আকৃষ্ট হয়।
          </p>
          <button className="inline-flex items-center gap-x-2 py-3 px-6 bg-yellow-400 font-medium text-gray-800 rounded-full hover:bg-yellow-300 transition">
            এখনই ব্রাউজ করুন
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
