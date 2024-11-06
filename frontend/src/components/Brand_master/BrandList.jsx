import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [message, setMessage] = useState('');

    const fetchBrands = async () => {
        try {
            const response = await fetch('/api/brands/');
            if (!response.ok) throw new Error('Failed to fetch brands');
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            setMessage(error.message);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <div className="container mx-auto mt-5">
            <h2 className="text-2xl font-bold mb-4">Brand List</h2>
            {/* {message && <div className="mb-4 p-4 bg-red-600 text-white rounded">{message}</div>} */}
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Brand Name</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.length > 0 ? (
                        brands.map((brand) => (
                            <tr key={brand.id}>
                                <td className="border border-gray-300 p-2">{brand.id}</td>
                                <td className="border border-gray-300 p-2">{brand.brand_name}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="border border-gray-300 p-2 text-center">No brands available</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br />
            <Link to="/add-brand" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">Add New Brand</Link>
        </div>
    );
};

export default BrandList;
