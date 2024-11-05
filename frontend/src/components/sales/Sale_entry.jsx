import React, { useState } from "react";

const SaleEntry = () => {
  const [invoiceNo, setInvoiceNo] = useState("INV-20241106-002632");
  const [invoiceDate, setInvoiceDate] = useState("06-11-2024");
  const [supplier, setSupplier] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState("");
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [subTotal, setSubTotal] = useState(0);

  const handleAddItem = () => {
    if (itemName && price && quantity) {
      const itemTotal = parseFloat(price) * parseInt(quantity, 10);
      setPurchaseDetails([
        ...purchaseDetails,
        { itemName, brand, price, quantity, total: itemTotal },
      ]);
      setSubTotal((prev) => prev + itemTotal);
      setItemName("");
      setBrand("");
      setPrice("");
      setQuantity("");
      setTotal("");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Sale Entry</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2">Invoice No:</label>
          <input
            type="text"
            value={invoiceNo}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2">Invoice Date:</label>
          <input
            type="text"
            value={invoiceDate}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2">Supplier Name:</label>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Supplier</option>
            <option value="Supplier1">Supplier1</option>
            <option value="Supplier2">Supplier2</option>
            {/* Add more supplier options as needed */}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block mb-2">Item Name:</label>
          <select
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Item</option>
            <option value="Item1">Item1</option>
            <option value="Item2">Item2</option>
            {/* Add more item options as needed */}
          </select>
        </div>
        <div>
          <label className="block mb-2">Brand:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-2">Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label className="block mb-2">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setTotal(e.target.value * price);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-2">Total:</label>
          <input
            type="text"
            value={total}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>
      <button
        onClick={handleAddItem}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add Item
      </button>

      <h3 className="text-2xl font-bold mt-6">Purchase Details</h3>
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2 px-4">S.No</th>
            <th className="py-2 px-4">Item Name</th>
            <th className="py-2 px-4">Rate</th>
            <th className="py-2 px-4">Quantity</th>
            <th className="py-2 px-4">Total</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {purchaseDetails.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 text-center">{index + 1}</td>
              <td className="py-2 px-4">{item.itemName}</td>
              <td className="py-2 px-4">{item.price}</td>
              <td className="py-2 px-4">{item.quantity}</td>
              <td className="py-2 px-4">{item.total.toFixed(2)}</td>
              <td className="py-2 px-4">
                {/* Add action button for delete or edit */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p className="text-xl font-bold">Sub Total: {subTotal.toFixed(2)}</p>
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Submit
      </button>
    </div>
  );
};

export default SaleEntry;
