import React, { useState, useEffect } from "react";
import axios from "axios";

const PurchaseEntry = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([]); // Store all items from API
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState("");
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [brands, setBrands] = useState([]); // Initialize the brands state variable

  useEffect(() => {
    // Fetch items data
    axios
      .get("http://127.0.0.1:8001/items_master/items/")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => console.error("Error fetching items:", error));

    // Fetch brands data from the new endpoint
    axios
      .get("http://127.0.0.1:8001/items_master/get_brands/")
      .then((response) => {
        setBrands(response.data); // Set the brands state
      })
      .catch((error) => console.error("Error fetching brands:", error));

    // Set invoice number and date
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

  // Handle item selection change
 const handleItemChange = (selectedItemName) => {
   setItemName(selectedItemName);

   const selectedItem = items.find(
     (item) => item.item_name === selectedItemName
   );
   console.log("Selected Item:", selectedItem); // Log selected item to inspect brand ID

   if (selectedItem) {
     console.log("Selected Item Brand ID:", selectedItem.brand); // Log the brand ID from the selected item
     console.log("Brands Data:", brands); // Log all brands data

     // Ensure that the brand ID and the brand object have the correct structure
     const selectedBrand = brands.find(
       (brand) => String(brand.id) === String(selectedItem.brand) // Ensure both are same type (e.g., string or number)
     );

     console.log("Selected Brand:", selectedBrand); // Log the result of the find operation

     // Set the brand name or show an error message if not found
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
            onChange={(e) => handleItemChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Item</option>
            {items.length > 0 ? (
              items.map((item) => (
                <option key={item.id} value={item.item_name}>
                  {item.item_name}
                </option>
              ))
            ) : (
              <option value="">Loading...</option>
            )}
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

export default PurchaseEntry;
