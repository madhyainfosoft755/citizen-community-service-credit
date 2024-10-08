import React, { useEffect, useRef, useState } from "react";
import { Button, Img, Text } from "components";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the DatePicker styles
import { API_URL, APP_PATH } from "Constant";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { toast } from "react-toastify";
import { format, subDays } from 'date-fns';
import "./style.css"

const DesktopNinePage = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  // const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  console.log("ye hain selected categoriews", selectedCategories)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isAllCategoriesSelected, setIsAllCategoriesSelected] = useState(true);
  const [dateRange, setDateRange] = useState("");
  const [isByDate, setIsByDate] = useState(false); // State to distinguish between date and category report
  // const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  // const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(subDays(new Date(), 31));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [chartData, setChartData] = useState(null); // State variable to hold chart data

  const datepickerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target) &&
        !event.target.classList.contains('react-datepicker__day') // Exclude clicks on datepicker days
      ) {
        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const handleStartDateChange = (date) => {
    setStartDate(date);
    setShowStartDatePicker(false);
    if (date && endDate) {
      fetchPostsForDateRange(date, endDate);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
    if (startDate && date) {
      fetchPostsForDateRange(startDate, date);
    }
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
    fetchPostsForDateRange(startDate, endDate);

  }, []);

  // useEffect(() => {
  //   // Fetch posts when component mounts with default dates and all categories selected
  // }, [startDate, endDate, categories]);

  const handleCategorySelection = (category) => {
    let updatedCategories = [];
    if (category === "All Categories") {
      setIsAllCategoriesSelected(!isAllCategoriesSelected);
      updatedCategories = !isAllCategoriesSelected ? categories.map(cat => cat.name) : [];
    } else {
      updatedCategories = isAllCategoriesSelected ? [] : [...selectedCategories];
      if (updatedCategories.includes(category)) {
        updatedCategories = updatedCategories.filter(cat => cat !== category);
      } else {
        updatedCategories.push(category);
      }
      setIsAllCategoriesSelected(updatedCategories.length === categories.length);
    }
    setSelectedCategories(updatedCategories);
    // fetchPostsForSelectedCategories(updatedCategories);
  };


  // const fetchPostsForDate = async (date) => {
  //   if (!selectedDate) {
  //     alert("Please select a date first.");
  //     return;
  //   }

  //   const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

  //   try {
  //     const response = await fetch(`${API_URL}/activity/postsForDate?date=${formattedDate}`);
  //     if (!response.ok) {
  //       const error = await response.json();
  //       notify(error.error)
  //       console.log("Failed to fetch posts for the selected date.");
  //       setPosts([]);
  //       setDateRange(""); // Clear date range on error
  //       return;
  //     }
  //     const data = await response.json();
  //     setPosts(data);
  //     setError(null);
  //     setDateRange(`${formattedDate} to ${formattedDate}`); // Set date range
  //     setIsByDate(true); // Set isByDate to true for date report
  //     setReportGenerated(true);
  //   } catch (error) {
  //     console.error("Error fetching posts:", error);
  //     setError("An error occurred while fetching posts.");
  //     setPosts([]);
  //     setDateRange(""); // Clear date range on error
  //   }
  // }


  const fetchPostsForDateRange = async (start, end) => {
    const formattedStartDate = format(start, 'yyyy-MM-dd');
    const formattedEndDate = format(end, 'yyyy-MM-dd');

    try {
      const response = await fetch(`${API_URL}/activity/postsForDateRange?start=${formattedStartDate}&end=${formattedEndDate}`);
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error);
        console.log("Failed to fetch posts for the selected date range.");
        setPosts([]);
        setDateRange("");
        return;
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
      setDateRange(`${formattedStartDate} to ${formattedEndDate}`);
      // setReportGenerated(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("An error occurred while fetching posts.");
      setPosts([]);
      setDateRange("");
    }
  };


  const fetchPostsForSelectedCategories = async (categories) => {
    try {
      let formattedStartDate = '';
      let formattedEndDate = '';

      if (startDate) {
        formattedStartDate = format(startDate, 'yyyy-MM-dd');
      }
      if (endDate) {
        formattedEndDate = format(endDate, 'yyyy-MM-dd');
      }
      const response = await fetch(`${API_URL}/activity/postsForCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories, start: formattedStartDate, end: formattedEndDate }),
      });
      if (!response.ok) {
        console.log("Failed to fetch posts for the selected categories.");
        const errorData = await response.json();
        toast.error(errorData.error);
        setPosts([]);
        setDateRange("");
        return;
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
      console.log("startDate:", startDate);
      console.log("endDate:", endDate);
      setDateRange(`${formattedStartDate} to ${formattedEndDate}`);
      setChartData(processData(data));  // Use filtered data to update chart

      // setReportGenerated(true);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("An error occurred while fetching posts.");
      setPosts([]);
      setDateRange("");
    }
  };



  const handleSubmit = async () => {
    try {
      let formattedStartDate = '';
      let formattedEndDate = '';

      if (startDate) {
        formattedStartDate = format(startDate, 'yyyy-MM-dd');
      }
      if (endDate) {
        formattedEndDate = format(endDate, 'yyyy-MM-dd');
      }

      const response = await fetch(`${API_URL}/activity/postsForCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: selectedCategories, start: formattedStartDate, end: formattedEndDate }),
      });
      if (!response.ok) {
        console.log("Failed to fetch posts for the selected categories.");
        const errorData = await response.json();
        toast.error(errorData.error);
        setPosts([]);
        setDateRange("");
        return;
      }
      const data = await response.json();
      console.log("what is the data", data)
      setPosts(data);
      setError(null);
      setDateRange(`${formattedStartDate} to ${formattedEndDate}`);
      // Update chart data with filtered posts
      const updatedChartData = processData(data);  // Process the filtered data
      console.log("Updated chart data:", updatedChartData);  // Debugging: Log updated chart data
      setChartData(updatedChartData);  // Update chart data
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("An error occurred while fetching posts.");
      setPosts([]);
      setDateRange("");
    }
  };





  useEffect(() => {
    if (posts.length > 0) {
      // Update chart data when posts change
      setChartData(processData(posts));
    }
  }, [posts]);


  console.log("================================", selectedCategories)
  // console.log("postsdata se pehele ka  console", posts)
  const processData = (posts) => {
    const categories = Array.from(new Set(posts.map(post => post.category))).filter(category => category); // Get unique categories
    console.log("kya aai categories", categories)
    const postCountByCategory = categories.reduce((acc, category) => {
      acc[category] = 0;
      posts.forEach(post => {
        if (post.category === category) {
          acc[category] += 1;
        }
      });
      return acc;
    },

      {});

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
  };








  return (
    <>
      <div className="w-screen h-screen bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
        <div className="relative  w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full lg:w-3/4 lg:h-full flex flex-col items-center justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
          <div className="relative w-full h-full flex flex-col items-center justify-start ">
            <div className="bg- flex flex-row items-center justify-between p-5 shadow-bs3 w-full">
              <div onClick={() => navigate("/admin")}>
                <Img className="h-4 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
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
                className=" flex flex-col items-center justify-between p-2 gap-1 w-full h-full "
              >
                <div className="flex flex-col items-center justify-center w-full md:w-full bg-[#f0f8ff] rounded-lg">
                  <div className="flex flex-row gap-4 items-center justify-center w-full h-12 flex-wrap ">

                    <div className="relative w-full h-full flex gap-2  p-1" ref={datepickerRef}>
                      <div className="relative w-1/2 h-full overflow-X-hidden ">
                        <label
                          className={`absolute left-2  transition-all duration-200 text-center text-xs bg-white-A700 rounded ${showStartDatePicker === true || startDate
                            ? '-top-1 text-xs text-center text-gray-700'
                            : 'top-1/2 transform -translate-y-1/2 translate-x-3 sm:translate-x-0 text-gray-500'
                            }`}
                          onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                        >
                          From Date
                        </label>
                        <Button
                          className={`w-full h-full text-black-900 cursor-pointer font-medium text-center text-xs  ${showStartDatePicker === true || startDate ? 'border-0 border-black-900_87' : 'border-none'}`}
                          shape="round"
                          onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                        >
                          {startDate ? format(startDate, 'dd/MM/yyyy') : ''}
                        </Button>
                      </div>
                      {showStartDatePicker && (
                        <div className="absolute -bottom-40 left-0 w-full h-full flex items-center justify-center z-50 ">
                          <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            maxDate={endDate || new Date()}
                            inline
                          />
                        </div>
                      )}

                      <div className="relative w-1/2 h-full overflow-X-hidden ">
                        <label
                          className={`absolute left-2 transition-all duration-200 text-center text-xs bg-white-A700 rounded ${showEndDatePicker === true || endDate
                            ? '-top-1 text-xs text-center text-gray-700'
                            : 'top-1/2 transform -translate-y-1/2 translate-x-4 sm:translate-x-2 text-gray-500'
                            }`}
                          onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                        >
                          To Date
                        </label>
                        <Button
                          className={`w-full h-full text-black-900 cursor-pointer font-medium text-center text-xs ${showEndDatePicker === true || endDate ? 'border-0 border-black-900_87' : 'border-none'}`}
                          shape="round"
                          onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                        >
                          {endDate ? format(endDate, 'dd/MM/yyyy') : ''}
                        </Button>
                      </div>
                      {showEndDatePicker && (
                        <div className="absolute -bottom-40 left-0 w-full h-full flex items-center justify-center z-50">
                          <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate || subDays(new Date())}
                            maxDate={new Date()}
                            inline
                          />
                        </div>
                      )}

                      <div className="relative w-1/2 h-full overflow-X-hidden">
                        <label className={`absolute left-2 transition-all duration-200 text-center text-xs bg-white-A700 rounded ${selectedCategories.length > 0 || showCategoryDropdown ? '-top-1 text-xs text-center text-gray-700' : 'top-1/2 transform -translate-y-1/2 translate-x-4 sm:translate-x-1 text-gray-500'}`} onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                          Select Category
                        </label>
                        <Button className={`!text-black-900 cursor-pointer font-medium w-full h-full text-center text-xs overflow-hidden flex ${selectedCategories.length > 0 || showCategoryDropdown ? 'border-2 border-black-900_87' : 'border-none'}`} shape="round" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                          {selectedCategories.length > 0 ? selectedCategories.join(", ") : ""}
                        </Button>
                      </div>
                      {showCategoryDropdown && (

                          <div className="absolute top-14 right-[0%] w-3/6 h-[300px] overflow-auto bg-white-A700 shadow rounded z-50 scroller" ref={dropdownRef}>
                            <div className="p-2 cursor-pointer hover:bg-blue-200 flex items-center">
                              <input type="checkbox" checked={isAllCategoriesSelected} onChange={() => handleCategorySelection("All Categories")} className="mr-2" />
                              All Categories
                            </div>
                            {categories.map((category) => (
                              <div key={category.id} className="p-2 cursor-pointer hover:bg-blue-200" onClick={() => handleCategorySelection(category.name)}>
                                <input type="checkbox" checked={selectedCategories.includes(category.name)} onChange={() => handleCategorySelection(category.name)} className="mr-2" />
                                {category.name}
                              </div>
                            ))}

                          {selectedCategories.length > 0 && (
                            <div className=" bg-white-A700  w-full p-2 border-t border-gray-300">
                              <Button className="w-full bg-indigo-500 text-white p-2 rounded text-white-A700" onClick={handleSubmit}>
                                Submit
                              </Button>
                            </div>

                          )}
                          </div>

                      )}
                    </div>
                  </div>


                </div>
                <div className="w-full h-full md:w-full flex items-center justify-center bg-white-A700 rounded-md">

                  {chartData ? (
                    <div className="w-full">


                      {/* <div className="horizontal flex justify-center text-sm font-bold">

                          Hours
                        </div> */}
                      <Bar data={processData(posts)} options={{
                        indexAxis: 'x', // Display bars vertically
                        scales: {
                          y: {
                            title: {
                              display: true,
                              text: 'Hours',
                            },
                            beginAtZero: true,
                            ticks: {
                              callback: function (value) {
                                if (Number.isInteger(value)) {
                                  return value;
                                }
                              },
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Categories',
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            display: false, // Disable the legend
                          },
                        },
                      }} className="w-full h-full" />

                    </div>) : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <Img className="w-[70%] h-auto object-cover object-center" src={APP_PATH + "images/nopost.svg"} alt="No posts available for endorsement" />
                    </div>
                  )}
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
