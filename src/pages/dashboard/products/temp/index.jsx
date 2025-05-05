import { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/table";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { ProductModal } from "./product-modal";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Custom cell renderers
  function renderImage(info) {
    return info.getValue() ? (
      <img 
        src={info.getValue()} 
        alt="Product" 
        className="h-10 w-10 rounded-full object-cover"
      />
    ) : (
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-xs text-gray-500">No img</span>
      </div>
    );
  }
  
  function renderPrice(info) {
    return `$${parseFloat(info.getValue()).toFixed(2)}`;
  }
  
  function renderActions(info) {
    const product = info.row.original;
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleEdit(product)}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="Edit product"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleDeleteClick(product)}
          className="p-1 text-red-600 hover:text-red-800"
          title="Delete product"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    );
  }

  const columns = [
    {
      header: "Image",
      accessorKey: "image",
      cell: renderImage
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: renderPrice
    },
    {
      header: "Whatsapp Number",
      accessorKey: "whatsappNumber",
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: renderActions
    },
  ];

  // Fetch products and categories from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const categoriesCollection = collection(db, "categories");
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoryList);
        
        // Fetch products
        const productsCollection = collection(db, "products");
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Find and add category title based on category_id
          category: categoryList.find(cat => cat.id === doc.data().category_id)?.title || "Unknown"
        }));
        
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter products based on search term and selected category
  useEffect(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);
  
  // Handle adding a new product
  const handleAddProduct = async (productData) => {
    try {
      const productsCollection = collection(db, "products");
      const docRef = await addDoc(productsCollection, productData);
      
      // Find category title
      const category = categories.find(cat => cat.id === productData.category_id);
      
      // Add new product to state
      const newProduct = {
        id: docRef.id,
        ...productData,
        category: category?.title || "Unknown"
      };
      
      setProducts([...products, newProduct]);
      return docRef;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };
  
  // Handle editing a product
  const handleEditProduct = async (productData) => {
    try {
      const productRef = doc(db, "products", selectedProduct.id);
      await updateDoc(productRef, productData);
      
      // Find category title
      const category = categories.find(cat => cat.id === productData.category_id);
      
      // Update product in state
      const updatedProducts = products.map(product => {
        if (product.id === selectedProduct.id) {
          return {
            ...product,
            ...productData,
            category: category?.title || "Unknown"
          };
        }
        return product;
      });
      
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };
  
  // Handle deleting a product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      const productRef = doc(db, "products", productToDelete.id);
      await deleteDoc(productRef);
      
      // Remove product from state
      const updatedProducts = products.filter(product => product.id !== productToDelete.id);
      setProducts(updatedProducts);
      
      // Close the delete confirmation modal
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle opening modal for editing
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  // Handle opening delete confirmation modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  
  // Handle form submission (add or edit)
  const handleSubmit = async (formData) => {
    if (selectedProduct) {
      return handleEditProduct(formData);
    } else {
      return handleAddProduct(formData);
    }
  };
  
  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Products</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="border rounded-xl border-slate-200">
            <div className="p-6 flex items-center justify-between gap-4">
              {/* Search & Category */}
              <div className="flex items-center gap-4">
                <input
                  name="search"
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block max-w-md shrink-0 w-full rounded-md bg-slate-50 px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md bg-slate-50 shrink-0 w-full pl-2 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedProduct(null);
                  setIsModalOpen(true);
                }}
                className="flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Product
              </button>
            </div>
            <DataTable 
              columns={columns} 
              data={{ data: filteredProducts }} 
            />
          </div>
          
          {/* Product Modal */}
          <ProductModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            onSubmit={handleSubmit}
            product={selectedProduct}
          />
          
          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteProduct}
            title="Delete Product"
            message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
            confirmButtonText="Delete"
            isLoading={isDeleting}
          />
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;
