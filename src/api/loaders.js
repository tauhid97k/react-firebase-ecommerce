import { categoriesService, productsService } from "@/lib/firebase-services";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

// Home page loaders
export const loadHomePageData = async () => {
  try {
    // Load hero section data
    const heroRef = doc(db, "home", "hero");
    const heroSnapshot = await getDoc(heroRef);
    let heroData = {};
    
    if (heroSnapshot.exists()) {
      heroData = heroSnapshot.data();
    }
    
    // Load categories for the home page (limited to 5)
    // Only show categories that are marked as visible
    const allCategories = await categoriesService.getAll();
    const visibleCategories = allCategories.filter(category => category.isVisible !== false);
    const homeCategories = visibleCategories.slice(0, 5);

    // Load products with categories for the product list section
    // Only show products that are marked as visible
    const allProducts = await productsService.getAllWithCategories();
    const products = allProducts.filter(product => product.isVisible !== false);
    
    // Group products by category for the product list section
    const categorizedProducts = [];
    
    // Sort categories by creation date (newest first)
    const sortedCategories = [...visibleCategories].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });
    
    for (const category of sortedCategories) {
      // Filter products for this category
      const categoryProducts = products
        .filter(product => product.category_id === category.id)
        .sort((a, b) => {
          // Sort by createdAt timestamp if available (newest first)
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        })
        // Limit to 4 products per category
        .slice(0, 4);
      
      if (categoryProducts.length > 0) {
        categorizedProducts.push({
          id: category.id,
          title: category.title,
          products: categoryProducts
        });
      }
    }

    return {
      hero: heroData,
      categories: homeCategories,
      categorizedProducts
    };
  } catch (error) {
    console.error("Error loading home page data:", error);
    throw error;
  }
};

// Categories page loader
export const loadCategoriesPageData = async ({ request, categoryId }) => {
  try {
    let selectedCategories = [];
    
    // If categoryId is provided directly (from route params), use it
    if (categoryId) {
      selectedCategories = [categoryId];
    }
    // Otherwise check URL search params
    else if (request) {
      const url = new URL(request.url);
      const categoryParam = url.searchParams.get('category');
      
      if (categoryParam) {
        // Check if it's a comma-separated list of category IDs
        if (categoryParam.includes(',')) {
          selectedCategories = categoryParam.split(',');
        } else {
          selectedCategories = [categoryParam];
        }
      }
    }
    
    // Load all categories
    const allCategories = await categoriesService.getAll();
    // Only show categories that are marked as visible
    const categories = allCategories.filter(category => category.isVisible !== false);
    
    // Load all products with category information
    const allProducts = await productsService.getAllWithCategories();
    // Only show products that are marked as visible
    const products = allProducts.filter(product => product.isVisible !== false);
    
    return {
      categories,
      products,
      selectedCategories
    };
  } catch (error) {
    console.error("Error loading categories page data:", error);
    throw error;
  }
};

// Product details page loader
export const loadProductDetails = async ({ params }) => {
  try {
    const { id } = params;
    
    // Load product details
    const product = await productsService.getById(id);
    
    // Check if product is visible, if not return null
    if (product && product.isVisible === false) {
      return { product: null, category: null };
    }
    
    // If product has a category_id, load the category details
    let category = null;
    if (product && product.category_id) {
      category = await categoriesService.getById(product.category_id);
      
      // Check if category is visible, if not return null
      if (category && category.isVisible === false) {
        return { product: null, category: null };
      }
    }
    
    return {
      product,
      category
    };
  } catch (error) {
    console.error("Error loading product details:", error);
    throw error;
  }
};

// Dashboard Overview Page Loader
export const loadDashboardOverview = async () => {
  try {
    // Fetch categories
    const categoriesCollection = collection(db, "categories");
    const categorySnapshot = await getDocs(categoriesCollection);
    const categoryList = categorySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      images: doc.data().images || [],
      productCount: 0 // Will be updated after fetching products
    }));
    
    // Fetch products
    const productsCollection = collection(db, "products");
    const q = query(productsCollection, orderBy("createdAt", "desc"));
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Count products per category
    const categoriesWithCount = categoryList.map(category => {
      const count = productList.filter(product => product.category_id === category.id).length;
      return { ...category, productCount: count };
    });
    
    // Select first category by default if available
    const selectedCategory = categoriesWithCount.length > 0 ? categoriesWithCount[0] : null;
    
    // Filter products for the selected category
    const filteredProducts = selectedCategory 
      ? productList.filter(product => product.category_id === selectedCategory.id)
      : [];
    
    return {
      categories: categoriesWithCount,
      products: productList,
      selectedCategory,
      filteredProducts
    };
  } catch (error) {
    console.error("Error loading dashboard overview:", error);
    throw error;
  }
};

// Dashboard Products Page Loader
export const loadDashboardProducts = async () => {
  try {
    // Fetch products
    const productsCollection = collection(db, "products");
    const q = query(productsCollection, orderBy("createdAt", "desc"));
    const productSnapshot = await getDocs(q);
    const productList = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Fetch categories for the dropdown
    const categoriesCollection = collection(db, "categories");
    const categorySnapshot = await getDocs(categoriesCollection);
    const categoryList = categorySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title
    }));
    
    return {
      products: productList,
      categories: categoryList
    };
  } catch (error) {
    console.error("Error loading dashboard products:", error);
    throw error;
  }
};

// Dashboard Categories Page Loader
export const loadDashboardCategories = async () => {
  try {
    // Fetch categories
    const categoriesCollection = collection(db, "categories");
    const q = query(categoriesCollection, orderBy("createdAt", "desc"));
    const categoriesSnapshot = await getDocs(q);
    const categoriesList = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Fetch products to count products per category
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);
    const productsList = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      categories: categoriesList,
      products: productsList
    };
  } catch (error) {
    console.error("Error loading dashboard categories:", error);
    throw error;
  }
};

// Dashboard Settings Page Loader
export const loadSettingsPage = async () => {
  try {
    // Check if settings document exists
    const settingsRef = doc(db, "settings", "global");
    const settingsSnapshot = await getDoc(settingsRef);
    
    if (settingsSnapshot.exists()) {
      // Return settings data
      return {
        settings: settingsSnapshot.data()
      };
    } else {
      // Return empty settings object if no settings exist yet
      return {
        settings: {}
      };
    }
  } catch (error) {
    console.error("Error loading settings:", error);
    throw error;
  }
};

// Dashboard Website Home Page Loader
export const loadWebsiteHomePage = async () => {
  try {
    // Check if home document exists
    const homeRef = doc(db, "home", "hero");
    const homeSnapshot = await getDoc(homeRef);
    
    console.log("Home page data from Firestore:", homeSnapshot.exists() ? homeSnapshot.data() : "No data");
    
    if (homeSnapshot.exists()) {
      // Return home data
      return {
        hero: homeSnapshot.data()
      };
    } else {
      // Return empty hero object if no data exists yet
      return {
        hero: {}
      };
    }
  } catch (error) {
    console.error("Error loading home page data:", error);
    throw error;
  }
};
