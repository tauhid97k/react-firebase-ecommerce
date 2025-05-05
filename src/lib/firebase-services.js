import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore/lite";
import { db } from "./firebase";

// Categories
export const categoriesService = {
  // Get all categories
  getAll: async () => {
    try {
      const categoriesCollection = collection(db, "categories");
      const snapshot = await getDocs(categoriesCollection);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting categories:", error);
      throw error;
    }
  },
  
  // Get a single category by ID
  getById: async (id) => {
    try {
      const categoryRef = doc(db, "categories", id);
      const categoryDoc = await getDoc(categoryRef);
      
      if (categoryDoc.exists()) {
        return {
          id: categoryDoc.id,
          ...categoryDoc.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting category:", error);
      throw error;
    }
  },
  
  // Add a new category
  add: async (categoryData) => {
    try {
      const categoriesCollection = collection(db, "categories");
      const docRef = await addDoc(categoriesCollection, {
        ...categoryData,
        createdAt: serverTimestamp()
      });
      return docRef;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  },
  
  // Update a category
  update: async (id, categoryData) => {
    try {
      const categoryRef = doc(db, "categories", id);
      await updateDoc(categoryRef, {
        ...categoryData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },
  
  // Delete a category
  delete: async (id) => {
    try {
      const categoryRef = doc(db, "categories", id);
      await deleteDoc(categoryRef);
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

// Products
export const productsService = {
  // Get all products
  getAll: async () => {
    try {
      const productsCollection = collection(db, "products");
      const snapshot = await getDocs(productsCollection);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },
  
  // Get products with category information
  getAllWithCategories: async () => {
    try {
      // Get all categories first
      const categories = await categoriesService.getAll();
      
      // Get all products
      const productsCollection = collection(db, "products");
      const snapshot = await getDocs(productsCollection);
      
      // Map products and add category information
      return snapshot.docs.map(doc => {
        const productData = doc.data();
        const category = categories.find(cat => cat.id === productData.category_id);
        
        return {
          id: doc.id,
          ...productData,
          category: category ? category.title : "Unknown"
        };
      });
    } catch (error) {
      console.error("Error getting products with categories:", error);
      throw error;
    }
  },
  
  // Get products by category ID
  getByCategory: async (categoryId) => {
    try {
      const productsCollection = collection(db, "products");
      const q = query(productsCollection, where("category_id", "==", categoryId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting products by category:", error);
      throw error;
    }
  },
  
  // Get a single product by ID
  getById: async (id) => {
    try {
      const productRef = doc(db, "products", id);
      const productDoc = await getDoc(productRef);
      
      if (productDoc.exists()) {
        return {
          id: productDoc.id,
          ...productDoc.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  },
  
  // Add a new product
  add: async (productData) => {
    try {
      const productsCollection = collection(db, "products");
      const docRef = await addDoc(productsCollection, {
        ...productData,
        createdAt: serverTimestamp()
      });
      return docRef;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },
  
  // Update a product
  update: async (id, productData) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },
  
  // Delete a product
  delete: async (id) => {
    try {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
};
