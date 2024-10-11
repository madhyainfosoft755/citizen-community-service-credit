// src/Charts.js
import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL } from "Constant";
import axios from "axios";
import { formatDate } from "utils";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./style.css";
import NoDataSVG from "../../assets/images/nopost.svg";

const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return null;
};

// thk hai ab humko sirf user ki jitni categories hain sirf unka data dikhana hai
// Register all necessary components
// Chart.register(...registerables);

const UserReports = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([
    { value: "all", label: "All Categories" },
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [barChartData, setBarChartData] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const [reportType, setReportType] = useState("approved");
  const barChartRef = useRef(null);
  const [barChart, setBarChart] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);

  console.log("allCategories", allCategories);

  useEffect(() => {
    if (barChartData && barChartRef.current) {
      if (barChart) {
        barChart.destroy();
      }

      const ctx = barChartRef.current.getContext("2d");
      const newChart = new Chart(ctx, {
        type: "bar",
        data: barChartData,
        options: options,
      });

      setBarChart(newChart);
    }

    // // Cleanup function
    // return () => {
    //   if (barChart) {
    //     barChart.destroy();
    //   }
    // };
  }, [barChartData]);

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
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found, user might not be logged in");
          return;
        }

        const response = await axios.get(
          `${API_URL}/activity/getUserCategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedCategories = response.data.map((category) => ({
          value: category,
          label: category,
        }));
        setAllCategories(formattedCategories);
        setSelectedCategories([{ value: "all", label: "All Categories" }]);
      } catch (error) {
        console.error("Error fetching categories", error);
        // Handle specific errors here, e.g., redirect to login if unauthorized
        if (error.response && error.response.status === 401) {
          // Redirect to login page or show login modal
          console.log("User is unauthorized, needs to login again");
          // Example: history.push('/login');
        }
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      fetchUserReport();
    }
  }, [selectedCategories, startDate, endDate, reportType]);

  const fetchUserReport = async () => {
    const categoriesToFetch = selectedCategories.some(
      (cat) => cat.value === "all"
    )
      ? allCategories.map((cat) => cat.value)
      : selectedCategories
          .filter((cat) => cat.value !== "all")
          .map((cat) => cat.value);

    const data = {
      categories: categoriesToFetch,
      start: formatDate(startDate),
      end: formatDate(endDate),
      reportType: reportType,
    };

    try {
      const headers = getAuthToken();
      const response = await axios.post(
        `${API_URL}/activity/get-user-report`,
        data,
        { headers }
      );
      const result = response.data;
      console.log("result", result);

      const hasData = Object.values(result).some((value) => value > 0);

      if (!hasData) {
        setNoDataFound(true);
        setBarChartData(null);
      } else {
        setNoDataFound(false);
        const dataAll = {
          labels: categoriesToFetch,
          datasets: [
            {
              label: "Activity",
              backgroundColor: categoriesToFetch.map(
                (_, index) => colorPalette[index % colorPalette.length]
              ),
              borderColor: categoriesToFetch.map(
                (_, index) => colorPalette[index % colorPalette.length]
              ),
              borderWidth: 1,
              hoverBackgroundColor: categoriesToFetch.map((_, index) =>
                colorPalette[index % colorPalette.length].replace("0.6", "0.4")
              ),
              hoverBorderColor: categoriesToFetch.map(
                (_, index) => colorPalette[index % colorPalette.length]
              ),
              data: categoriesToFetch.map((category) => result[category] || 0),
            },
          ],
        };
        setBarChartData(dataAll);
      }
    } catch (err) {
      console.error("Error fetching user report", err);
      setNoDataFound(true);
      setBarChartData(null);
    }
  };

  const getNoDataMessage = () => {
    switch (reportType) {
      case "approved":
        return "No approved posts found for the selected criteria.";
      case "endorsed":
        return "No endorsed posts found for the selected criteria.";
      case "unendorsed":
        return "No unendorsed posts found for the selected criteria.";
      case "all":
        return "No posts found for the selected criteria.";
      default:
        return "No data found for the selected criteria.";
    }
  };

  // useEffect(() => {
  //   async function fetchUserReport() {
  //     if (allCategories.length === 0) return;

  //     const data = {
  //       categories: allCategories.map((value) => value.name),
  //       start: formatDate(startDate),
  //       end: formatDate(endDate),
  //       reportType: reportType,
  //     };
  //     try {
  //       const headers = getAuthToken();
  //       const response = await axios.post(
  //         `${API_URL}/activity/get-user-report`,
  //         data,
  //         {
  //           headers,
  //         }
  //       );
  //       const result = response.data;
  //       const dataAll = {
  //         labels: allCategories.map((value) => value.name),
  //         datasets: [
  //           {
  //             label: "All",
  //             backgroundColor: allCategories.map(
  //               (_, index) => colorPalette[index % colorPalette.length]
  //             ),
  //             borderColor: allCategories.map(
  //               (_, index) => colorPalette[index % colorPalette.length]
  //             ),
  //             borderWidth: 1,
  //             hoverBackgroundColor: allCategories.map((_, index) =>
  //               colorPalette[index % colorPalette.length].replace("0.6", "0.4")
  //             ),
  //             hoverBorderColor: allCategories.map(
  //               (_, index) => colorPalette[index % colorPalette.length]
  //             ),
  //             data: allCategories.map((value) => result[value.name]),
  //           },
  //         ],
  //       };
  //       setBarChartData(dataAll);
  //     } catch (err) {
  //       console.error("Error fetching user report", err);
  //     }
  //   }
  //   fetchUserReport();
  // }, [allCategories, startDate, endDate, reportType]);

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
        ticks: {
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          },
        },
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
    window.addEventListener("resize", checkScreenSize);

    // Initial check on component mount
    checkScreenSize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Define styles for the component
  const containerStyle = {
    minWidth: isMobile ? "100%" : "500px",
  };

  // Add this function to handle changes in the Select component
  const handleCategoryChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "all")) {
      setSelectedCategories([
        { value: "all", label: "All Categories" },
        ...allCategories,
      ]);
    } else {
      setSelectedCategories(selectedOptions);
    }
  };

  return (
    <div className="flex flex-col items-center sm:p-0 p-4 md:p-6  space-y-8 border-2 md:border-none overflow-x-auto">
      {/* Header with Back Button */}

      <div
        className="max-w-full  border md:border-none sm:p-0 md:p-6 rounded-lg "
        style={containerStyle}
      >
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
          <div className="flex items-center justify-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="border rounded px-2 py-1 w-full bg-green-400"
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

          <div className="w-full flex items-center justify-between gap-2">
            <div className="w-full p-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Categories
              </label>
              <Select
                isMulti
                options={[
                  { value: "all", label: "All Categories" },
                  ...allCategories,
                ]}
                value={selectedCategories}
                onChange={(selected) => setSelectedCategories(selected)}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            <div className="w-full p-3">
              <label className="block text-sm font-medium text-gray-700">
                Report Type
              </label>
              <Select
                options={[
                  { value: "all", label: "All Posts" },
                  { value: "approved", label: "Approved Posts" },
                  { value: "endorsed", label: "Endorsed Posts" },
                  { value: "unendorsed", label: "Unendorsed Posts" },
                ]}
                value={{
                  value: reportType,
                  label:
                    reportType.charAt(0).toUpperCase() +
                    reportType.slice(1) +
                    " Posts",
                }}
                onChange={(selected) => setReportType(selected.value)}
                className="basic-select"
                classNamePrefix="select"
              />
            </div>
          </div>
        </div>

        <div className="w-full p-1">
          <h2 className="text-xl font-semibold text-center mb-4">Bar Chart</h2>
          <div className="w-full h-64">
            {noDataFound ? (
              <div className="flex flex-col items-center justify-center h-full">
                <img className="w-20" src={NoDataSVG} alt="No Data" />
                <p className="text-center text-gray-500 mt-4">
                  {getNoDataMessage()}
                </p>
              </div>
            ) : barChartData ? (
              <canvas ref={barChartRef} />
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
