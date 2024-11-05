import React from 'react'
import { useNavigate } from 'react-router-dom';

const Add_Supplier = () => {
        const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Add New Supplier</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
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
}

export default Add_Supplier