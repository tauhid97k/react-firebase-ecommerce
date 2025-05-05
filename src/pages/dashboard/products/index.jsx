import { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/table";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore/lite";
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
    const images = info.getValue();
    
    if (!images || images.length === 0) {
      return (
        <div className="h-14 w-14 rounded-lg bg-gray-200 flex items-center justify-center">
          <span className="text-xs text-gray-500">No img</span>
        </div>
      );
    }
    
    // Display the first image as main, with small indicators for additional images
    return (
      <div className="flex items-center">
        <div className="relative shrink-0">
          <img 
            src={images[0].url} 
            alt="Product" 
            className="h-14 w-14 rounded-lg object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17a3f093956%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17a3f093956%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22108.5390625%22%20y%3D%2296.3%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
              e.target.classList.add('error');
            }}
          />
          {images.length > 1 && (
            <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              +{images.length - 1}
            </div>
          )}
        </div>
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
      accessorKey: "images",
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
      
      // Fetch products with ordering by createdAt in descending order
      const productsCollection = collection(db, "products");
      const q = query(productsCollection, orderBy("createdAt", "desc"));
      const productSnapshot = await getDocs(q);
      
      const productList = productSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log(`Product ${doc.id}:`, data);
        return {
          id: doc.id,
          ...data,
          // Ensure createdAt exists for sorting
          createdAt: data.createdAt || Date.now()
        };
      });
      
      console.log("Products in descending order:", productList.map(p => ({ id: p.id, title: p.title, createdAt: p.createdAt })));
      setProducts(productList);
      setFilteredProducts(productList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
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
      
      // Create a simplified product object with optimized image storage
      const simplifiedProduct = {
        title: productData.title,
        description: productData.description,
        quantity: parseInt(productData.quantity),
        price: parseFloat(productData.price),
        whatsappNumber: productData.whatsappNumber,
        category_id: productData.category_id,
        // Store just the image URLs as an array of objects
        images: productData.images.map(img => ({
          url: img.url
        })),
        // Add a timestamp for sorting
        createdAt: Date.now()
      };
      
      // Find category title
      const category = categories.find(cat => cat.id === productData.category_id);
      simplifiedProduct.category = category?.title || "Unknown";
      
      console.log("Adding new product:", simplifiedProduct);
      const docRef = await addDoc(productsCollection, simplifiedProduct);
      
      // Add new product to state
      const newProduct = {
        id: docRef.id,
        ...simplifiedProduct
      };
      
      setProducts([...products, newProduct]);
      return docRef;
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  
  // Handle editing a product
  const handleEditProduct = async (productData) => {
    try {
      // Create a simplified product object with optimized image storage
      const simplifiedProduct = {
        title: productData.title,
        description: productData.description,
        quantity: parseInt(productData.quantity),
        price: parseFloat(productData.price),
        whatsappNumber: productData.whatsappNumber,
        category_id: productData.category_id,
        // Store just the image URLs as an array of objects
        images: productData.images.map(img => ({
          url: img.url
        })),
        // Update the timestamp
        updatedAt: Date.now()
      };
      
      // Find category title
      const category = categories.find(cat => cat.id === productData.category_id);
      simplifiedProduct.category = category?.title || "Unknown";
      
      console.log("Updating product:", simplifiedProduct);
      const productRef = doc(db, "products", selectedProduct.id);
      await updateDoc(productRef, simplifiedProduct);
      
      // Update product in state
      const updatedProducts = products.map(product => {
        if (product.id === selectedProduct.id) {
          return {
            ...product,
            ...simplifiedProduct
          };
        }
        return product;
      });
      
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product:", error);
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
    // Ensure selectedProduct is reset when modal is closed
    setSelectedProduct(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Products</h1>
      
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
              // Simply reset the selected product and open the modal
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
          data={filteredProducts} 
          isLoading={isLoading}
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
    </div>
  );
};

export default AdminProductsPage;
