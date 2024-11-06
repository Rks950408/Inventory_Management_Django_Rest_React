import React, { useState, useEffect } from 'react';
import ItemRow from './ItemRow';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch items from your API endpoint
        const fetchItems = async () => {
            const response = await fetch(`/api/items?search=${searchQuery}`);
            const data = await response.json();
            setItems(data);
        };
        fetchItems();
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(e.target.search.value);
    };

    return (
        <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-bold mb-4">Items List</h2>

            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex">
                    <input
                        type="text"
                        name="search"
                        className="form-input w-full border border-gray-300 rounded-l-md p-2"
                        placeholder="Search items..."
                        defaultValue={searchQuery}
                    />
                    <button className="btn bg-blue-500 text-white rounded-r-md p-2" type="submit">Search</button>
                </div>
            </form>

            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">S.No</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Brand</th>
                        <th className="py-2 px-4 border-b">Unit Price</th>
                        <th className="py-2 px-4 border-b">Images</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <ItemRow key={item.id} item={item} index={index} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">No items found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <a href="/add-item" className="btn bg-green-500 text-white rounded mt-4 inline-block p-2">Add Item</a>
        </div>
    );
};

export default ItemList;
