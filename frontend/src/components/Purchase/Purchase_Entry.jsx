import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchaseEntry = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState("");
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplier, setSupplier] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8001/supplier/suppliers/")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error fetching suppliers:", error));

    axios
      .get("http://127.0.0.1:8001/items_master/items/")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error));

    axios
      .get("http://127.0.0.1:8001/items_master/get_brands/")
      .then((response) => setBrands(response.data))
      .catch((error) => console.error("Error fetching brands:", error));

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const minsec = `${String(now.getMinutes()).padStart(2, "0")}${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    setInvoiceNo(`IN-${dd}${mm}${yyyy}-${minsec}`);
    setInvoiceDate(`${dd}-${mm}-${yyyy}`);
  }, []);

  const handleSupplierChange = (e) => setSupplier(e.target.value);

  const handleItemChange = (selectedItemName) => {
    setItemName(selectedItemName);
    const selectedItem = items.find(
      (item) => item.item_name === selectedItemName
    );
    if (selectedItem) {
      const selectedBrand = brands.find(
        (brand) => String(brand.id) === String(selectedItem.brand)
      );
      setBrand(selectedBrand ? selectedBrand.brand_name : "Brand Not Found");
      setPrice(selectedItem.unit_price);
    } else {
      setBrand("No Item Selected");
      setPrice("");
    }
  };

  const handleAddItem = () => {
    if (itemName && price && quantity) {
      const itemTotal = parseFloat(price) * parseInt(quantity, 10);
      const existingItemIndex = purchaseDetails.findIndex(
        (item) => item.itemName === itemName
      );

      if (existingItemIndex !== -1) {
        const updatedDetails = [...purchaseDetails];
        updatedDetails[existingItemIndex].quantity += parseInt(quantity, 10);
        updatedDetails[existingItemIndex].total += itemTotal;
        setPurchaseDetails(updatedDetails);
      } else {
        setPurchaseDetails([
          ...purchaseDetails,
          {
            itemName,
            brand,
            price,
            quantity: parseInt(quantity, 10),
            total: itemTotal,
          },
        ]);
      }

      setSubTotal((prev) => prev + itemTotal);
      setItemName("");
      setBrand("");
      setPrice("");
      setQuantity("");
      setTotal("");
    }
  };

  const handleDelete = (index) => {
    const itemToDelete = purchaseDetails[index];
    setSubTotal((prev) => prev - itemToDelete.total);
    setPurchaseDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Purchase Entry</h2>
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
            onChange={handleSupplierChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sup) => (
              <option
                key={sup.id}
                value={sup.name}
                disabled={sup.name === supplier}
              >
                {sup.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block mb-2">Item Name:</label>
          <select
            value={itemName}
            onChange={(e) => handleItemChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.item_name}>
                {item.item_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Brand:</label>
          <input
            type="text"
            value={brand}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2">Price:</label>
          <input
            type="text"
            value={price}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
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
              <td className="py-2 px-4 text-center">{item.itemName}</td>
              <td className="py-2 px-4 text-center">{item.price}</td>
              <td className="py-2 px-4 text-center">{item.quantity}</td>
              <td className="py-2 px-4 text-center">{item.total.toFixed(2)}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
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

export default PurchaseEntry;
