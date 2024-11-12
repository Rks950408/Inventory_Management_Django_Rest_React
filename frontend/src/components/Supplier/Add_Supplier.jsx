import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddSupplier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    status: true, // Default status
    entry_date: new Date().toISOString(), // Set the current date by default
  });
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message

    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/supplier/suppliers/create/",
        formData
      );
      console.log("Supplier added successfully:", response.data);
      // Redirect to the suppliers list after successful addition
      navigate("/suppliers-list");
    } catch (error) {
      // Check if there's a specific error response from the backend
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Set the error message from backend
      } else {
        setErrorMessage("An error occurred. Please try again."); // Generic error message
      }
      console.error("Error adding supplier:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add New Supplier</h2>
      {errorMessage && (
        <p className="mb-4 text-red-500">{errorMessage}</p> // Display the error message if it exists
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contact" className="block text-gray-700">
            Contact:
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700">
            Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Supplier
        </button>
      </form>
      <br />
      <button
        onClick={() => navigate("/suppliers-list")}
        className="w-full bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
      >
        Back to Supplier List
      </button>
    </div>
  );
};

export default AddSupplier;
