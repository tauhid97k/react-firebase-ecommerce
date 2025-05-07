"use client";

import { Link, useLoaderData } from "react-router";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { PhoneIcon } from "@heroicons/react/24/solid";

export default function ProductDetails() {
  // Use the loader data instead of fetching in useEffect
  const { product, category } = useLoaderData();

  // Function to handle WhatsApp contact
  const handleContactForOrder = () => {
    if (!product) return;
    
    if (product.whatsappNumber) {
      // Format the WhatsApp number (remove any non-digit characters)
      const formattedNumber = product.whatsappNumber.replace(/\D/g, '');
      // Create message text
      const message = `Hello, I'm interested in ordering the product: ${product.title}. Please provide more information.`;
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
    } else {
      alert("No WhatsApp number available for this product.");
    }
  };

  if (!product) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <p className="text-center">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {product && product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <Tab
                      key={index}
                      className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-indigo-500/50 focus:ring-offset-4 focus:outline-hidden"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-md">
                        <img
                          alt={`Product image ${index + 1}`}
                          src={image.url}
                          className="size-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                            e.target.classList.add('error');
                          }}
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-indigo-500"
                      />
                    </Tab>
                  ))
                ) : (
                  <div className="col-span-4 h-24 flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-gray-500 text-sm">No images available</p>
                  </div>
                )}
              </TabList>
            </div>

            <TabPanels>
              {product && product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <TabPanel key={index}>
                    <img
                      alt={`Product image ${index + 1}`}
                      src={image.url}
                      className="aspect-square w-full object-cover sm:rounded-lg"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                        e.target.classList.add('error');
                      }}
                    />
                  </TabPanel>
                ))
              ) : (
                <TabPanel>
                  <div className="aspect-square w-full bg-gray-100 flex items-center justify-center sm:rounded-lg">
                    <p className="text-gray-500">No image available</p>
                  </div>
                </TabPanel>
              )}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product?.title}
              </h1>
              {category && (
                <Link 
                  to={`/categories?category=${category.id}`}
                  className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800 hover:bg-indigo-200 cursor-pointer"
                  title="Click to see all products in this category"
                >
                  {category.title}
                </Link>
              )}
            </div>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                ${parseFloat(product?.price || 0).toFixed(2)}
              </p>
            </div>

            {/* Quantity */}
            {product?.quantity && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  Available: <span className="font-medium">{product.quantity}</span> in stock
                </p>
              </div>
            )}

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-2 space-y-6 text-base text-gray-700">
                <p>{product?.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={handleContactForOrder}
                className="flex w-full items-center justify-center gap-x-2 rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
              >
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                Contact for Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
