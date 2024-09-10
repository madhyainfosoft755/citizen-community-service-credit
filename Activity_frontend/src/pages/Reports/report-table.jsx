// src/Charts.js
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL } from "Constant";
import axios from "axios";
import { formatDate } from "utils";
import { useNavigate } from "react-router-dom";

const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return null;
};

const UserReportsTable = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reportData, setReportData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get(`${API_URL}/activity/getCategories`);
                setAllCategories(response.data);

                // Select all categories by default
                setSelectedCategories(response.data.map((cat) => ({
                    value: cat.name,
                    label: cat.name,
                })));
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        async function fetchUserReport() {
            if (selectedCategories.length === 0) return;

            const data = {
                categories: selectedCategories.map((value) => value.value),
                start: formatDate(startDate),
                end: formatDate(endDate),
            };
            try {
                const headers = getAuthToken();
                const response = await axios.post(
                    `${API_URL}/activity/get-user-report`,
                    data,
                    {
                        headers,
                    }
                );
                setReportData(response.data);
            } catch (err) {
                console.error("Error fetching user report", err);
            }
        }
        fetchUserReport();
    }, [selectedCategories, startDate, endDate]);

    return (
        <div className="flex flex-col items-center sm:p-0 space-y-8 md:p-6">
            <header className="w-full sm:w-full flex justify-between items-center p-4 md:p-6 bg-gray-100">
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => navigate(-1)} // Go back to the previous page
                >
                    &larr; Back
                </button>
                <h1 className="text-2xl font-bold">Personal Reports</h1>
                <div></div> {/* Empty div for flex spacing */}
            </header>

            <div className="w-full max-w-2xl p-2">
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            // className="border rounded px-2 py-1 w-full"
                            style={{ width: "100%", padding: "1rem", border: "1px solid blue" }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            End Date
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            className="border border-blue-200 rounded px-2 py-1 w-full"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Select Categories
                    </label>
                    <Select
                        isMulti
                        options={allCategories.map((cat) => ({
                            value: cat.name,
                            label: cat.name,
                        }))}
                        value={selectedCategories}
                        onChange={(selected) => setSelectedCategories(selected)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
            </div>

            <div className="w-full max-w-2xl p-2">
                <h2 className="text-xl font-semibold text-center mb-4">User Report Table</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Category</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300">Activity Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCategories.map((category, index) => (
                                <tr key={category.value}>
                                    <td className="py-2 px-4 border-b border-gray-300">{category.label}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        {reportData[category.value] || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserReportsTable;
