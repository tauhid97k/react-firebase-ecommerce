import { useState, useEffect } from "react";
import { Form, useLoaderData, useSubmit, useRevalidator } from "react-router";
import { ImageUploader } from "@/components/shared/image-uploader";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const AdminSettingsPage = () => {
  const { settings } = useLoaderData();
  const submit = useSubmit();
  const revalidator = useRevalidator();
  const [logo, setLogo] = useState([]);
  const [logoAlt, setLogoAlt] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize form data from loader
  useEffect(() => {
    if (settings) {
      // Set logo if it exists
      if (settings.logo_img) {
        setLogo([{ url: settings.logo_img }]);
      }
      // Set logo alt text if it exists
      if (settings.logo_img_alt) {
        setLogoAlt(settings.logo_img_alt);
      }
    }
  }, [settings]);

  // Handle logo image change
  const handleLogoChange = (images) => {
    // Replace the existing logo with the new one
    setLogo(images.slice(-1)); // Only keep the last image
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create form data
    const formData = new FormData();
    formData.append("logo_img_alt", logoAlt);
    
    // Add logo image if available
    if (logo.length > 0) {
      formData.append("logo_img", logo[0].url);
    }
    
    // Submit form
    submit(formData, { method: "post" });
    
    // Show success message
    setSuccessMessage("Settings updated successfully!");
    
    // Revalidate to refresh data across the app
    revalidator.revalidate();
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Configure your application settings
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

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <Form method="post" onSubmit={handleSubmit}>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Logo Setup
                </h2>
                <div className="mt-2">
                  <ImageUploader
                    images={logo}
                    onChange={handleLogoChange}
                    maxImages={1}
                    storageFolder="settings"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Upload your logo image. Only one image is allowed.
                </p>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="logo_alt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Logo Alt Text
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="logo_alt"
                    id="logo_alt"
                    value={logoAlt}
                    onChange={(e) => setLogoAlt(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="Brand Logo"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This text will be used as the alt attribute for your logo image.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
