/**
 * Utility functions for handling file uploads in the browser
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a local file object with a base64 data URL
 * 
 * @param {File} file - The file to process
 * @param {string} folder - The folder name (products, categories)
 * @param {string} [itemId] - Optional item ID to group files
 * @returns {Promise<{url: string, path: string, name: string, id: string}>}
 */
export const createLocalFileObject = (file, folder, itemId = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate IDs
      const folderId = itemId || uuidv4();
      const fileId = uuidv4();
      const fileName = file.name;
      
      // Create a FileReader to convert the file to base64
      const reader = new FileReader();
      
      reader.onload = (event) => {
        // Get base64 data URL
        const base64Url = event.target.result;
        
        // Construct a virtual path (for reference only)
        const virtualPath = `${folder}/${folderId}/${fileId}-${fileName}`;
        
        // Return metadata with base64 URL
        resolve({
          id: fileId,
          url: base64Url,  // Base64 data URL for preview and storage
          path: virtualPath, // Virtual path for reference
          name: fileName,
          folderId
        });
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(error);
      };
      
      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error creating file object:', error);
      reject(error);
    }
  });
};

/**
 * Releases the object URL to free up memory
 * @param {string} objectUrl - The object URL to release
 */
export const releaseObjectUrl = (objectUrl) => {
  if (objectUrl && objectUrl.startsWith('blob:')) {
    URL.revokeObjectURL(objectUrl);
  }
};

/**
 * In a real application, this would be replaced with an API call to upload the file
 * For now, we're just simulating the upload process with object URLs
 */
export const uploadFileToServer = async (fileObject) => {
  // In a real app, this would be an API call to upload the file to the server
  // For now, we're just returning the same object
  return fileObject;
};

/**
 * In a real application, this would be replaced with an API call to delete the file
 */
export const deleteFileFromServer = async (fileObject) => {
  // In a real app, this would be an API call to delete the file from the server
  // For now, we're just releasing the object URL
  if (fileObject && fileObject.url) {
    releaseObjectUrl(fileObject.url);
  }
  return true;
};
