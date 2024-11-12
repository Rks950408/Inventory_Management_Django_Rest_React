import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // Get item ID from the URL
  const [formData, setFormData] = useState({
    item_name: "",
    brand: "", // This will store the brand ID (foreign key)
    category: "",
    unit_price: "", // Keep this as a string until conversion to number
    image: null,
  });
  const [message, setMessage] = useState("");
  const [brands, setBrands] = useState([]); // State to hold brand data

  // Fetch brands from backend on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8001/items_master/get_brands/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await response.json();
        setBrands(data); // Set the fetched brand data to state
      } catch (error) {
        setMessage("Error fetching brands: " + error.message);
      }
    };

    fetchBrands();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Fetch item data based on the ID
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8001/items_master/items/${id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch item");
        }
        const data = await response.json();
        setFormData({
          item_name: data.item_name,
          brand: data.brand.id,  // Assuming the response includes the brand object
          category: data.category,
          unit_price: data.unit_price,
          image: null,  // You can decide if you want to show the existing image
        });
      } catch (error) {
        setMessage("Error fetching item: " + error.message);
      }
    };

    fetchItem();
  }, [id]);  // Fetch item when the `id` changes (i.e., when the user clicks Edit)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    // Log form data before submission to confirm the brand ID
    console.log("Form Data Before Submit:", formData);

    form.append("item_name", formData.item_name);
    form.append("category", formData.category);
    form.append("unit_price", formData.unit_price);
    if (formData.image) form.append("image", formData.image);

    // Check if brand is selected, ensure it's a valid number
    if (formData.brand && !isNaN(formData.brand)) {
      const brandId = parseInt(formData.brand, 10); // Convert to integer (brand ID)
      console.log("Converted Brand ID:", brandId); // Debugging: Log the brand ID
      form.append("brand", brandId); // Append brand ID to form data
    } else {
      setMessage("Please select a valid brand.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/items_master/items/${id}/update/`,  // Assuming the API is set up for updating with the item ID
        {
          method: "PUT",
          body: form,
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMessage("Item updated successfully!");
        setTimeout(() => navigate("/item"), 1000); // Redirect after 2 seconds
      } else {
        setMessage(`Error: ${data.message || "Something went wrong."}`);
      }
    } catch (error) {
      setMessage("Error: Something went wrong.");
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4">Update Item</h2>
      {message && (
        <div
          className={`mb-4 p-4 text-white rounded ${
            message.includes("Error") ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="item_name"
          >
            Item Name:
          </label>
          <input
            type="text"
            name="item_name"
            id="item_name"
            value={formData.item_name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Brand Dropdown */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="brand"
          >
            Brand Name:
          </label>
          <select
            name="brand"
            id="brand"
            value={formData.brand} // Stores the selected brand ID (foreign key)
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.brand_name} {/* Display brand name */}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="category"
          >
            Category:
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Stationary">Stationary</option>
            <option value="Clothing">Clothing</option>
            <option value="Home Goods">Home Goods</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Unit Price */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="unit_price"
          >
            Unit Price:
          </label>
          <input
            type="number"
            name="unit_price"
            id="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Image */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="image"
          >
            Image:
          </label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          Update Item
        </button>
      </form>
      <br />
      <button
        onClick={() => navigate("/item")}
        className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
      >
        Back to Items List
      </button>
    </div>
  );
};

export default UpdateItem;
