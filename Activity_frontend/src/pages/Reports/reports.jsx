// src/Charts.js
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL } from "Constant";
import axios from "axios";
import { formatDate } from "utils";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./style.css";

const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        };
    }
    return null;
};

// Register all necessary components
Chart.register(...registerables);

const UserReports = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [barChartData, setBarChartData] = useState(null);
    const navigate = useNavigate(); // Initialize navigate

    // Define color palette for categories
    const colorPalette = [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
    ];

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get(`${API_URL}/activity/getCategories`);
                setAllCategories(response.data);
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
                const result = response.data;
                const dataAll = {
                    labels: selectedCategories.map((value) => value.label),
                    datasets: [
                        {
                            label: "All",
                            backgroundColor: selectedCategories.map(
                                (_, index) => colorPalette[index % colorPalette.length]
                            ),
                            borderColor: selectedCategories.map(
                                (_, index) => colorPalette[index % colorPalette.length]
                            ),
                            borderWidth: 1,
                            hoverBackgroundColor: selectedCategories.map(
                                (_, index) =>
                                    colorPalette[index % colorPalette.length].replace(
                                        "0.6",
                                        "0.4"
                                    )
                            ),
                            hoverBorderColor: selectedCategories.map(
                                (_, index) => colorPalette[index % colorPalette.length]
                            ),
                            data: selectedCategories.map((value) => result[value.value]),
                        },
                    ],
                };
                setBarChartData(dataAll);
            } catch (err) {
                console.error("Error fetching user report", err);
            }
        }
        fetchUserReport();
    }, [selectedCategories, startDate, endDate]);

    useEffect(() => {
        async function fetchUserReport() {
            if (allCategories.length === 0) return;

            const data = {
                categories: allCategories.map((value) => value.name),
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
                const result = response.data;
                const dataAll = {
                    labels: allCategories.map((value) => value.name),
                    datasets: [
                        {
                            label: "All",
                            backgroundColor: allCategories.map(
                                (_, index) => colorPalette[index % colorPalette.length]
                            ),
                            borderColor: allCategories.map(
                                (_, index) => colorPalette[index % colorPalette.length]
                            ),
                            borderWidth: 1,
                            hoverBackgroundColor: allCategories.map(
                                (_, index) =>
                                    colorPalette[index % colorPalette.length].replace(
                                        "0.6",
                                        "0.4"
                                    )
                            ),
                            hoverBorderColor: allCategories.map(
                                (_, index) => colorPalette[index % colorPalette.length]
                            ),
                            data: allCategories.map((value) => result[value.name]),
                        },
                    ],
                };
                setBarChartData(dataAll);
            } catch (err) {
                console.error("Error fetching user report", err);
            }
        }
        fetchUserReport();
    }, [allCategories, startDate, endDate]);

    const pieData = {
        labels: selectedCategories.map((value) => value.label),
        datasets: [
            {
                label: "Activity by Category",
                data: barChartData
                    ? barChartData.datasets[0].data
                    : selectedCategories.map(() => 0), // Adjust as necessary
                backgroundColor: selectedCategories.map(
                    (_, index) => colorPalette[index % colorPalette.length]
                ),
                borderColor: selectedCategories.map(
                    (_, index) => colorPalette[index % colorPalette.length]
                ),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Activity",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Categories",
                },
            },
        },
    };


    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Function to check the screen width and set isMobile state
        const checkScreenSize = () => {
            // Set breakpoint for mobile screen, e.g., 640px
            setIsMobile(window.innerWidth < 640);
        };

        // Add event listener to check screen size on window resize
        window.addEventListener('resize', checkScreenSize);

        // Initial check on component mount
        checkScreenSize();

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // Define styles for the component
    const containerStyle = {
        minWidth: isMobile ? '100%' : '500px',
    };


    return (
        <div className="flex flex-col items-center sm:p-0 p-4 md:p-6  space-y-8 border-2 md:border-none overflow-x-auto">
            {/* Header with Back Button */}


            <div className="max-w-full  border md:border-none sm:p-0 md:p-6 rounded-lg" style={containerStyle}>
                <div className="w-full max-w-[500px] space-y-4">
                    <div className="w-full flex justify-between items-center p-4 md:p-6 bg-gray-100">
                        <button
                            onClick={() => navigate(-1)} // Navigate to the previous page
                            className="text-blue-500 hover:text-blue-700"
                        >
                            &larr; Back
                        </button>
                        <h1 className="text-xl font-semibold">Personal Reports</h1>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="border rounded px-2 py-1 w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                style={{ border: "1px solid gray" }}
                                className="border rounded px-2 py-1 w-full"
                            />
                        </div>
                    </div>
                    <div className="p-3">
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

                <div className="w-full max-w-md p-1">
                    <h2 className="text-xl font-semibold text-center mb-4">Bar Chart</h2>
                    <div className="h-64">
                        {barChartData ? (
                            <Bar data={barChartData} options={options} />
                        ) : (
                            <p className="text-center text-gray-500">Loading data...</p>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-md p-1">
                    {/* <h2 className="text-xl font-semibold text-center mb-4">Pie Chart</h2> */}
                    <div className="h-64">
                        {/* <Pie data={pieData} options={{ maintainAspectRatio: false }} /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserReports;
