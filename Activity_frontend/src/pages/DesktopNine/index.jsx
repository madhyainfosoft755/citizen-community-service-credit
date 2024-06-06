import React, { useEffect, useState } from "react";
import { Button, Img, Text } from "components";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the DatePicker styles
import { API_URL } from "Constant";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { toast } from "react-toastify";
import { format, subDays } from 'date-fns';

const DesktopNinePage = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // State to control category dropdown visibility
  const [categories, setCategories] = useState([]); // State for categories
  const [dateRange, setDateRange] = useState(""); // State for date range
  const [isByDate, setIsByDate] = useState(false); // State to distinguish between date and category report

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Close the calendar after date selection
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`);
      if (!response.ok) {
        toast.error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
  }, []);

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false); // Close the dropdown after category selection
  };

  const fetchPostsForDate = async (date) => {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    try {
      const response = await fetch(`${API_URL}/activity/postsForDate?date=${formattedDate}`);
      if (!response.ok) {
        const error = await response.json();
        notify(error.error)
        console.log("Failed to fetch posts for the selected date.");
        setPosts([]);
        setDateRange(""); // Clear date range on error
        return;
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
      setDateRange(`${formattedDate} to ${formattedDate}`); // Set date range
      setIsByDate(true); // Set isByDate to true for date report
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("An error occurred while fetching posts.");
      setPosts([]);
      setDateRange(""); // Clear date range on error
    }
  }

  const fetchPostsForCategory = async () => {
    if (!selectedCategory) {
      alert("Please select a category first.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    try {
      const response = await fetch(`${API_URL}/activity/postsForCategory?category=${selectedCategory}`);
      if (!response.ok) {
        console.log("Failed to fetch posts for the selected category.");
        const errorData = await response.json();
        setError(errorData.error);
        setPosts([]);
        setDateRange(""); // Clear date range on error
        return;
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
      setDateRange(`${formattedDate} to ${formattedDate}`); // Set date range
      setIsByDate(false); // Set isByDate to false for category report
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("An error occurred while fetching posts.");
      setPosts([]);
      setDateRange(""); // Clear date range on error
    }
  }

  const processData = (posts) => {
    if (isByDate) {
      const categories = Array.from(new Set(posts.map(post => post.category))).filter(category => category); // Get unique categories
      const postCountByCategory = categories.reduce((acc, category) => {
        acc[category] = 0;
        posts.forEach(post => {
          if (post.category === category) {
            acc[category] += 1;
          }
        });
        return acc;
      }, {});

      return {
        labels: categories,
        datasets: [
          {
            data: Object.values(postCountByCategory),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384'
            ],
          },
        ],
      };
    } else {
      const lastSevenDays = Array.from({ length: 7 }).map((_, index) =>
        format(subDays(new Date(), 6 - index), 'yyyy-MM-dd')
      );

      const postCountByDate = lastSevenDays.reduce((acc, date) => {
        acc[date] = 0; // Initialize each date with 0 posts
        posts.forEach(post => {
          const postDate = post?.Date?.split('T')[0]; // Ensure to access the correct 'Date' field from posts
          if (postDate === date) {
            acc[date] += 1;
          }
        });
        return acc;
      }, {});

      return {
        labels: lastSevenDays,
        datasets: [
          {
            data: Object.values(postCountByDate),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384'
            ],
          },
        ],
      };
    }
  };

  return (
    <>
      <div className="w-screen h-screen bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
        <div className="relative  w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
          <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="bg-white-A700 flex flex-row items-center justify-between p-5 shadow-bs3 w-full">
              <div onClick={() => navigate("/admin")}>
                <Img className="h-4 cursor-pointer" src="images/img_arrowleft.svg" alt="arrowleft" />
              </div>
              <Text
                className=" text-gray-900"
                size="txtInterSemiBold17"
              >
                Generate Report
              </Text>
              <div />
            </div>
            <div className="flex flex-col items-center justify-center w-full h-full md:w-full ">
              <div
                className=" flex flex-col items-center justify-between p-2 gap-2 w-full h-full "
              >
                <div className="flex flex-col items-center justify-center w-full md:w-full bg-blue-400 rounded-lg">
                  <div className="flex flex-row gap-4 items-center justify-center w-full h-12 flex-wrap ">
                    <div className=" relative w-1/3 ">
                      <Button
                        className="text-black-900 cursor-pointer font-medium w-full text-center text-xs"
                        shape="round"
                        onClick={() => setShowCalendar(true)} // Show calendar on button click
                      >
                        Select Date
                      </Button>
                      {/* Calendar Popup */}
                      {showCalendar && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white-A700  rounded shadow">
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateSelection}
                            // minDate={new Date()} // Optional: Restrict past dates
                            showPopperArrow={false} // Optional: Hide the arrow in the calendar popup
                            dateFormat="dd/MM/yyyy" // Optional: Customize date format
                            className="text-xs text-center"
                          />
                        </div>
                      )}
                    </div>
                    <div className=" relative w-1/3 ">
                      <Button
                        className="!text-black-900 cursor-pointer font-medium w-full text-center text-xs"
                        shape="round"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} // Toggle category dropdown on button click
                      >
                        Select Category
                      </Button>
                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 w-full bg-white-A700 shadow rounded z-50">
                          {categories.map((category) => (
                            <div
                              key={category.id}
                              className="p-2 cursor-pointer hover:bg-blue-200"
                              onClick={() => handleCategorySelection(category.name)}
                            >
                              {category.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full h-4/5 flex items-center justify-center bg-[#d6e2f8] rounded-md">
                  {posts.length > 0 ? (
                    <Bar data={processData(posts)} options={{
                      indexAxis: 'x', // Display bars vertically
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                      plugins: {
                        legend: {
                          display: false, // Disable the legend
                        },
                      },
                    }} className="w-full h-full" />
                  ) : (
                    <p>No posts found</p>
                  )}
                </div>
                <div className="w-full flex items-center justify-center ">
                  <Text size="txtInterRegular14" className="text-gray-700">
                    {selectedCategory || isByDate ? (
                      <Text  className="text-gray-700 text-center">
                        {isByDate
                          ? `Data of different categories for ${format(selectedDate,"dd-MM-yyyy")}`
                          : `Data of the ${selectedCategory} from ${format(subDays(new Date(), 6), 'dd-MM-yyyy')} to ${format(new Date(), 'dd-MM-yyyy')}`}
                      </Text>
                    ) : null}
                  </Text>
                </div>
                <div className="flex items-center justify-between gap-2 w-full">
                  <Button
                    className="cursor-pointer font-semibold w-full text-base text-center rounded-md"
                    color="indigo_A200"
                    onClick={fetchPostsForDate}
                  >
                    GENERATE REPORT <br />BY DATE
                  </Button>
                  <Button
                    className="cursor-pointer font-semibold w-full text-base text-center rounded-md "
                    color="indigo_A200"
                    onClick={fetchPostsForCategory}
                  >
                    GENERATE REPORT <br />BY CATEGORY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopNinePage;
