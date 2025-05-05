import { useState, useRef, useEffect } from "react";
import { XMarkIcon, PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import { createLocalFileObject, releaseObjectUrl, deleteFileFromServer } from "@/lib/file-upload";

export const ImageUploader = ({ images = [], onChange, maxImages = 5, storageFolder = "products" }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    if (images.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    setError("");
    
    const newProgress = { ...uploadProgress };
    const newImages = [...images];
    const processedFiles = [];

    // Get the product/category ID if we're editing an existing item
    // This ensures all images for the same product are in the same folder
    const existingFolderId = images.length > 0 ? images[0].folderId : null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) {
        continue;
      }

      const fileId = uuidv4();
      newProgress[fileId] = 0;
      
      try {
        // Simulate upload progress
        const updateProgress = () => {
          if (newProgress[fileId] < 100) {
            newProgress[fileId] += 10;
            setUploadProgress({ ...newProgress });
            if (newProgress[fileId] < 100) {
              setTimeout(updateProgress, 100);
            }
          }
        };
        updateProgress();
        
        // Create local file object with preview URL
        const fileObject = await createLocalFileObject(file, storageFolder, existingFolderId);
        
        // Add to images array
        newImages.push(fileObject);
        processedFiles.push(fileObject);
        
        // Complete progress
        newProgress[fileId] = 100;
        setUploadProgress({ ...newProgress });
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        // Remove from progress tracking
        delete newProgress[fileId];
        setUploadProgress({ ...newProgress });
      }
    }
    
    // Update parent component with new images
    onChange(newImages);
  };

  const handleRemoveImage = async (index) => {
    try {
      const imageToRemove = images[index];
      
      // Release the object URL to free memory
      if (imageToRemove.url) {
        releaseObjectUrl(imageToRemove.url);
      }
      
      // In a real app, you would call an API to delete the file from the server
      await deleteFileFromServer(imageToRemove);
      
      // Remove from state
      const newImages = [...images];
      newImages.splice(index, 1);
      onChange(newImages);
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Release all object URLs to prevent memory leaks
      images.forEach(image => {
        if (image.url && image.url.startsWith('blob:')) {
          releaseObjectUrl(image.url);
        }
      });
    };
  }, [images]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
        
        <PhotoIcon className="h-12 w-12 text-gray-400" />
        <div className="mt-2 text-center">
          <p className="text-sm font-semibold text-gray-900">
            Drag and drop images here
          </p>
          <p className="text-xs text-gray-500 mt-1">
            or click to browse (PNG, JPG, WEBP up to 5MB)
          </p>
        </div>
        <button
          type="button"
          className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
        >
          <ArrowUpTrayIcon className="-ml-0.5 mr-2 h-4 w-4" />
          Upload Images
        </button>
        <p className="text-xs text-gray-500 mt-2">
          {images.length} of {maxImages} images uploaded
        </p>
      </div>

      {/* Progress indicators */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <img 
                  src={image.url} 
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                    e.target.classList.add('error');
                  }}
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-70 hover:opacity-100"
              >
                <XMarkIcon className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
