import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddItem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: "",
    brand: "", 
    category: "",
    unit_price: "", 
    image: null,
  });
  const [message, setMessage] = useState("");
  const [brands, setBrands] = useState([]); 

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
        setBrands(data); 
      } catch (error) {
        setMessage("Error fetching brands: " + error.message);
      }
    };

    fetchBrands();
  }, []); 

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

   console.log("Form Data Before Submit:", formData);

   form.append("item_name", formData.item_name);
   form.append("category", formData.category);
   form.append("unit_price", formData.unit_price);
   if (formData.image) form.append("image", formData.image);

   if (formData.brand && !isNaN(formData.brand)) {
     const brandId = parseInt(formData.brand, 10); 
     console.log("Converted Brand ID:", brandId); 
     form.append("brand", brandId); 
   } else {
     setMessage("Please select a valid brand.");
     return;
   }

   try {
     const response = await fetch(
       "http://127.0.0.1:8001/items_master/items/create/",
       {
         method: "POST",
         body: form,
       }
     );
     const data = await response.json();

     if (response.ok) {
       setMessage("Item added successfully!");
       setTimeout(() => navigate("/item"), 1000); 
     } else {
       setMessage(`Error: ${data.message || "This Item is already Exist."}`);
     }
   } catch (error) {
     setMessage("Error: Something went wrong.");
   }
 };




  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4">Add Item</h2>
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
          Save Item
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

export default AddItem;