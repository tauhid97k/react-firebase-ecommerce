import { FaShop } from "react-icons/fa6";
import { SlCallOut } from "react-icons/sl";
import { MdEmail } from "react-icons/md";

const ContactPage = () => {
  return (
    <div className="bg-white">
      <div className="max-w-5xl px-4 xl:px-0 py-10 lg:py-20 mx-auto">
        {/* Title */}
        <div className="max-w-3xl flex flex-col items-center justify-center mb-10 lg:mb-14">
          <h2 className="text-gray-900 font-semibold text-2xl md:text-4xl md:leading-tight">
            Contact us
          </h2>
          <p className="mt-1 text-gray-600">
            Whatever you need to sell just contact us. We are here to help
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16">
          {/* Form */}
          <div className="md:order-2 border-b border-gray-200 pb-10 mb-10 md:border-b-0 md:pb-0 md:mb-0">
            <form>
              <div className="space-y-4">
                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    id="input-name"
                    placeholder="Name"
                    className="peer p-3 sm:p-4 block w-full bg-gray-100 border border-gray-300 rounded-lg sm:text-sm text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <label
                    htmlFor="input-name"
                    className="absolute top-0 start-0 p-3 sm:p-4 h-full text-gray-500 text-sm truncate pointer-events-none transition-all duration-150
                      peer-placeholder-shown:translate-y-0
                      peer-placeholder-shown:text-base
                      peer-focus:-translate-y-2
                      peer-focus:text-sm"
                  >
                    Name
                  </label>
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    id="input-email"
                    placeholder="Email"
                    className="peer p-3 sm:p-4 block w-full bg-gray-100 border border-gray-300 rounded-lg sm:text-sm text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <label
                    htmlFor="input-email"
                    className="absolute top-0 start-0 p-3 sm:p-4 h-full text-gray-500 text-sm truncate pointer-events-none transition-all duration-150
                      peer-placeholder-shown:translate-y-0
                      peer-placeholder-shown:text-base
                      peer-focus:-translate-y-2
                      peer-focus:text-sm"
                  >
                    Email
                  </label>
                </div>

                {/* Company */}
                <div className="relative">
                  <input
                    type="text"
                    id="input-company"
                    placeholder="Company"
                    className="peer p-3 sm:p-4 block w-full bg-gray-100 border border-gray-300 rounded-lg sm:text-sm text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <label
                    htmlFor="input-company"
                    className="absolute top-0 start-0 p-3 sm:p-4 h-full text-gray-500 text-sm truncate pointer-events-none transition-all duration-150
                      peer-placeholder-shown:translate-y-0
                      peer-placeholder-shown:text-base
                      peer-focus:-translate-y-2
                      peer-focus:text-sm"
                  >
                    Company
                  </label>
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="text"
                    id="input-phone"
                    placeholder="Phone"
                    className="peer p-3 sm:p-4 block w-full bg-gray-100 border border-gray-300 rounded-lg sm:text-sm text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                  <label
                    htmlFor="input-phone"
                    className="absolute top-0 start-0 p-3 sm:p-4 h-full text-gray-500 text-sm truncate pointer-events-none transition-all duration-150
                      peer-placeholder-shown:translate-y-0
                      peer-placeholder-shown:text-base
                      peer-focus:-translate-y-2
                      peer-focus:text-sm"
                  >
                    Phone
                  </label>
                </div>

                {/* Message */}
                <div className="relative">
                  <textarea
                    id="input-message"
                    placeholder="Tell us about your project"
                    rows="4"
                    className="peer p-3 sm:p-4 block w-full bg-gray-100 border border-gray-300 rounded-lg sm:text-sm text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  ></textarea>
                  <label
                    htmlFor="input-message"
                    className="absolute top-0 start-0 p-3 sm:p-4 h-full text-gray-500 text-sm truncate pointer-events-none transition-all duration-150
                      peer-placeholder-shown:translate-y-0
                      peer-placeholder-shown:text-base
                      peer-focus:-translate-y-2
                      peer-focus:text-sm"
                  >
                    Tell us what is your product
                  </label>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                All fields are required
              </p>

              <div className="mt-5">
                <button
                  type="submit"
                  className="inline-flex items-center gap-x-2 py-2 px-4 bg-yellow-400 font-medium text-sm text-gray-800 rounded-full hover:bg-yellow-300 transition"
                >
                  Submit
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
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-14">
            {/* Address */}
            <div className="flex gap-x-5">
              <FaShop className="h-10 w-10" />
              <div>
                <h4 className="text-gray-900 font-semibold">Our address:</h4>
                <address className="mt-1 text-gray-600 text-sm not-italic">
                  A Block, Banashree
                  <br />
                  Rampura, Dhaka-1219
                </address>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-x-5">
              <MdEmail className="h-10 w-10" />
              <div>
                <h4 className="text-gray-900 font-semibold">Email us:</h4>
                <a
                  href="mailto:hello@example.so"
                  className="mt-1 text-gray-600 text-sm hover:text-gray-900"
                >
                  hello@example.so
                </a>
              </div>
            </div>

            {/* Hiring */}
            <div className="flex gap-x-5">
              <SlCallOut className="h-10 w-10" />
              <div>
                <h4 className="text-gray-900 font-semibold">Phone Number</h4>
                <p className="mt-1 text-gray-600">+8801616367606</p>
              </div>
            </div>
          </div>
        </div>
        {/* End Grid */}
      </div>
    </div>
  );
};

export default ContactPage;
