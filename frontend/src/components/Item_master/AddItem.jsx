import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddItem = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        item_name: '',
        brand: '',
        category: '',
        unit_price: '',
        image: null,
    });
    const [message, setMessage] = useState('');

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
        for (const key in formData) {
            form.append(key, formData[key]);
        }

        try {
            const response = await fetch('/api/items/', {
                method: 'POST',
                body: form,
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('Item added successfully!');
                setTimeout(() => navigate('/items'), 2000); // Redirect after 2 seconds
            } else {
                setMessage(`Error: ${data.message || 'Failed to add item.'}`);
            }
        } catch (error) {
            setMessage('Error: Something went wrong.');
        }
    };

    return (
        <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-bold mb-4">Add Item</h2>
            {message && (
                <div className={`mb-4 p-4 text-white rounded ${message.includes('Error') ? 'bg-red-600' : 'bg-green-600'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="item_name">Item Name:</label>
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
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="brand">Brand Name:</label>
                    <input
                        type="text"
                        name="brand"
                        id="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700" htmlFor="category">Category:</label>
    <select
        name="category"
        id="category"
        value={formData.category}
        onChange={handleChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        required
    >
        <option value="">Select a category</option> {/* Empty option for prompt */}
        <option value="Electronics">Electronics</option>
        <option value="Stationary">Stationary</option>
        <option value="Clothing">Clothing</option>
        <option value="Home Goods">Home Goods</option>
        <option value="Books">Books</option>
        <option value="Other">Other</option>
    </select>
</div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="unit_price">Unit Price:</label>
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
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="image">Image:</label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Save Item</button>
            </form>
            <br />
            <button onClick={() => navigate('/item')} className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600">
                Back to Items List
            </button>
        </div>
    );
};

export default AddItem;
