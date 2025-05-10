import { collection, addDoc, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

// Category mutations
export const addCategory = async ({ formData }) => {
  try {
    // Create a simple category object with title, images, and timestamp
    const simplifiedCategory = {
      title: formData.title,
      // Store just the image URLs as an array of objects
      images: formData.images.map(img => ({
        url: img.url
      })),
      // Add visibility field
      isVisible: formData.isVisible !== undefined ? formData.isVisible : true,
      // Add a timestamp for sorting
      createdAt: Date.now()
    };
    
    const docRef = await addDoc(collection(db, "categories"), simplifiedCategory);
    return { id: docRef.id, ...simplifiedCategory };
  } catch (error) {
    throw new Error(`Failed to add category: ${error.message}`);
  }
};

export const updateCategory = async ({ id, formData }) => {
  try {
    // Convert isVisible to boolean
    let isVisible = false;
    if (formData.isVisible === true || formData.isVisible === 'true') {
      isVisible = true;
    }
    
    // Create a simple category object with title, images, and timestamp
    const simplifiedCategory = {
      title: formData.title,
      // Store just the image URLs as an array of objects
      images: formData.images.map(img => ({
        url: img.url
      })),
      // Set visibility as a boolean
      isVisible: isVisible,
      // Don't update the timestamp for edits
    };
    
    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, simplifiedCategory);
    return { id, ...simplifiedCategory };
  } catch (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }
};

export const deleteCategory = async ({ id }) => {
  try {
    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);
    return { id };
  } catch (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
};

// Product mutations
export const addProduct = async ({ formData }) => {
  try {
    // Create a product object with all fields and timestamp
    const simplifiedProduct = {
      title: formData.title,
      description: formData.description,
      quantity: formData.quantity,
      price: formData.price,
      whatsappNumber: formData.whatsappNumber,
      category_id: formData.category_id,
      // Add stock warning threshold field
      stock_warning_at: formData.stock_warning_at || "5",
      // Add visibility field
      isVisible: formData.isVisible !== undefined ? formData.isVisible : true,
      images: formData.images.map(img => ({
        url: img.url
      })),
      createdAt: Date.now()
    };
    
    const docRef = await addDoc(collection(db, "products"), simplifiedProduct);
    return { id: docRef.id, ...simplifiedProduct };
  } catch (error) {
    throw new Error(`Failed to add product: ${error.message}`);
  }
};

export const updateProduct = async ({ id, formData }) => {
  try {
    // Convert isVisible to boolean
    let isVisible = false;
    if (formData.isVisible === true || formData.isVisible === 'true') {
      isVisible = true;
    }
    
    // Create a clean product object with all fields properly formatted
    const simplifiedProduct = {
      title: formData.title,
      description: formData.description,
      quantity: formData.quantity,
      price: formData.price,
      whatsappNumber: formData.whatsappNumber,
      category_id: formData.category_id,
      // Ensure stock_warning_at is properly formatted
      stock_warning_at: formData.stock_warning_at || "5",
      // Set visibility as a boolean
      isVisible: isVisible,
      // Format images properly
      images: formData.images.map(img => ({
        url: img.url
      })),
    };
    
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, simplifiedProduct);
    return { id, ...simplifiedProduct };
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

export const deleteProduct = async ({ id }) => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    return { id };
  } catch (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};

// Settings mutations
export const updateSettings = async ({ formData }) => {
  try {
    // Create a settings object with logo and alt text
    const settingsData = {
      logo_img: formData.get('logo_img') || null,
      logo_img_alt: formData.get('logo_img_alt') || 'Brand Logo',
      updatedAt: Date.now()
    };
    
    // Use setDoc with merge option to create or update the document
    const settingsRef = doc(db, "settings", "global");
    await setDoc(settingsRef, settingsData, { merge: true });
    
    return settingsData;
  } catch (error) {
    throw new Error(`Failed to update settings: ${error.message}`);
  }
};
