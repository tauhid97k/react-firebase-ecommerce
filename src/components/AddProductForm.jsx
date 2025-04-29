import { useState } from "react";

const categories = [
  { id: "1", title: "Honey" },
  { id: "2", title: "Ghee" },
  { id: "3", title: "Dates" },
  { id: "4", title: "Mustard Oil" },
  { id: "5", title: "Molasses" },
];

export default function AddProductForm({ onAdd }) {
  const [form, setForm] = useState({
    category_id: "",
    title: "",
    description: "",
    quantity: "",
    price: "",
    image: [],
    whatsapp_number: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.some((file) => file.size > 1024 * 1024);
    if (oversized) {
      setError("Each image must be less than 1MB");
      return;
    }
    setForm({ ...form, image: files });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category_id || !form.title || !form.price) {
      setError("Category, Title and Price are required");
      return;
    }
    onAdd(form);
    alert("Product added successfully!");
    setForm({
      category_id: "",
      title: "",
      description: "",
      quantity: "",
      price: "",
      image: [],
      whatsapp_number: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          WhatsApp Number
        </label>
        <input
          name="whatsapp_number"
          value={form.whatsapp_number}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Images (max 5, each &lt; 1MB)
        </label>
        <input
          name="image"
          type="file"
          onChange={handleImageChange}
          multiple
          accept="image/*"
          className="mt-1 block w-full text-sm"
        />
        <p className="text-sm text-gray-500 mt-1">
          Selected: {form.image.length} file(s)
        </p>
      </div>

      <button
        type="submit"
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
      >
        Submit Product
      </button>
    </form>
  );
}
