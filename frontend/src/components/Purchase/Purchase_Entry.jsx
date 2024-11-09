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
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

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
    setInvoiceDate(`${yyyy}-${mm}-${dd}`); // Set to API format (YYYY-MM-DD)
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
      const itemTotal = parseFloat((price * quantity).toFixed(2));
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
            item_name: itemName,
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

  const handleSubmit = async () => {
    const purchaseData = {
      invoice_no: invoiceNo,
      invoice_date: invoiceDate,
      supplier,
      total_amount: subTotal,
      purchase_details: purchaseDetails,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/purchases/purchase-entry/",
        purchaseData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Purchase data submitted successfully:", response.data);
      setSuccessMessage(response.data.message); // Display success message
      // Reset form after successful submission
      setInvoiceNo("");
      setInvoiceDate("");
      setSupplier("");
      setPurchaseDetails([]);
      setSubTotal(0);
    } catch (error) {
      console.error("Error submitting purchase data:", error);
      setSuccessMessage("Failed to submit purchase data. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Purchase Entry</h2>
      {successMessage && (
        <div className="text-green-500 font-semibold mb-4">
          {successMessage}
        </div>
      )}
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
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <strong>Subtotal: {subTotal.toFixed(2)}</strong>{" "}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-green-600"
      >
        Submit
      </button>
    </div>
  );
};

export default PurchaseEntry;
