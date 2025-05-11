import { useState, useEffect } from "react";
import { Form, useLoaderData, useSubmit, useNavigation, useActionData } from "react-router";
import { ImageUploader } from "@/components/shared/image-uploader";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

const WebsiteHomePage = () => {
  const { hero } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const [heroBg, setHeroBg] = useState([]);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Check if the form is being submitted
  const isSubmitting = navigation.state === "submitting";

  // Initialize form data from loader
  useEffect(() => {
    if (hero) {
      // Set hero background if it exists
      if (hero.hero_bg) {
        setHeroBg([{ url: hero.hero_bg }]);
      } else {
        setHeroBg([]);
      }
      
      // Set hero title if it exists
      if (hero.hero_title) {
        setHeroTitle(hero.hero_title);
      } else {
        setHeroTitle("Welcome to our store");
      }
      
      // Set hero description if it exists
      if (hero.hero_description) {
        setHeroDescription(hero.hero_description);
      } else {
        setHeroDescription("Find the best products for your needs");
      }
    }
  }, [hero]);
  
  // Handle hero background image change
  const handleHeroBgChange = (images) => {
    // Clear any previous error messages when a new image is selected
    setErrorMessage("");
    
    // Replace the existing image with the new one
    if (images && images.length > 0) {
      // Check image size before setting it
      const imageUrl = images[0].url;
      const MAX_SIZE = 900000; // ~900KB
      
      if (imageUrl && imageUrl.length > MAX_SIZE) {
        setErrorMessage(`Image size (${Math.round(imageUrl.length / 1024)} KB) exceeds the maximum allowed size (900 KB). Please use a smaller image.`);
        return;
      }
      
      setHeroBg(images.slice(-1)); // Only keep the last image
    } else {
      setHeroBg([]);
    }
  };

  // Debug the current hero background image
  useEffect(() => {
    if (heroBg.length > 0 && heroBg[0].url) {
      console.log("Current hero background image size:", Math.round(heroBg[0].url.length / 1024), "KB");
    }
  }, [heroBg]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear any previous messages
    setErrorMessage("");
    
    // Create form data
    const formData = new FormData();
    formData.append("hero_title", heroTitle);
    formData.append("hero_description", heroDescription);
    
    // Add hero background image if available
    if (heroBg.length > 0 && heroBg[0].url) {
      formData.append("hero_bg", heroBg[0].url);
    }
    
    // Submit form
    submit(formData, { method: "post" });
    
    // Show success message immediately
    setSuccessMessage("Hero section updated successfully!");
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };
  
  // Handle error messages from action data
  useEffect(() => {
    if (actionData && actionData.error) {
      // Show error message
      setErrorMessage(actionData.error);
      setSuccessMessage(""); // Clear any success message
    }
  }, [actionData]);
  
  // For debugging
  console.log("Navigation state:", navigation.state);
  console.log("Action data:", actionData);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Website Home Page
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Configure your website home page content
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errorMessage}
              </p>
              {actionData?.errorType === 'SIZE_EXCEEDED' && (
                <p className="mt-2 text-sm text-red-700">
                  Try using a smaller image or compress the current one before uploading.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <Form method="post" onSubmit={handleSubmit}>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Hero Section Setup
                </h2>
                <div className="mt-2">
                  <ImageUploader
                    images={heroBg}
                    onChange={handleHeroBgChange}
                    maxImages={1}
                    storageFolder="home"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload your hero background image. Only one image is allowed. Maximum size is approximately 900KB.
                </p>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="hero_title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hero Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="hero_title"
                    id="hero_title"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="Enter hero title"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This text will be displayed as the main heading in the hero section.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="hero_description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hero Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="hero_description"
                    name="hero_description"
                    rows={3}
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="Enter hero description"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This text will be displayed as a paragraph below the hero title.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-md ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-500'} px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default WebsiteHomePage;
