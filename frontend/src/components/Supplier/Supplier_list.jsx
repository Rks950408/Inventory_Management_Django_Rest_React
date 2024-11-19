import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SupplierList = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8001/supplier/suppliers/"
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Suppliers List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Contact</th>
            <th className="py-2 px-4 border-b text-left">Address</th>
            {/* <th className="py-2 px-4 border-b text-left">Status</th> */}
          </tr>
        </thead>
        <tbody>
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="py-2 px-4">{supplier.name}</td>
                <td className="py-2 px-4">{supplier.contact}</td>
                <td className="py-2 px-4">{supplier.address}</td>
                {/* <td className="py-2 px-4">
                  {supplier.status ? "Active" : "Inactive"}
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No suppliers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={() => navigate("/suppliers")}
        className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 mt-12"
      >
        Add Supplier
      </button>
    </div>
  );
};

export default SupplierList;
