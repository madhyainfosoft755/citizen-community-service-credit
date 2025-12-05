// import React, { useEffect, useRef, useState } from "react";

// import { Button, Img, Text } from "components";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCirclePlus, faCircleXmark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import { API_URL, APP_PATH } from "Constant";
// import * as Switch from '@radix-ui/react-switch';
// // import * as ToggleGroup from '@radix-ui/react-toggle-group';
// import "./style.css"

// const DesktopSixPage = () => {
//   const notify = (e) => toast(e);
//   const navigate = useNavigate();
//   const [showinput, setShowInput] = useState(false)
//   const [categoryName, setCategoryName] = useState(""); // State for the category name
//   const [error, setError] = useState("")
//   const [categories, setCategories] = useState([]); // State for the categories
//   const popUpRef = useRef(null); // Create a ref for the pop-up

//   const toggleInput = () => {
//     setShowInput(!showinput);
//     setCategoryName("");
//     setError("");
//   };


//   const goback = () => {
//     navigate("/admin")
//   }

//   const handleClickOutside = (event) => {
//     if (popUpRef.current && !popUpRef.current.contains(event.target)) {
//       setShowInput(false); // Close the pop-up if click is outside it
//       setError("")
//       setCategoryName("")
//       // console.log("2",event.target)
//     }
//   };


//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside); // Attach event listener on mount
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside); // Detach event listener on unmount
//     };
//   }, []); // Empty dependency array ensures that this effect runs only once on mount

//   const toggleinput = () => {
//     setShowInput(!showinput)
//     // console.log(showinput)
//     if (showinput) {
//       setCategoryName("")
//       setError("");
//     }
//   }

//   const handleInputChange = (e) => {
//     setCategoryName(e.target.value); // Update state on input change
//     setError(""); // Clear error when user starts typing
//   };

//   const handleCreateCategory = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`${API_URL}/activity/createCategory`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: categoryName }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         setError(data.message);
//         // notify(data.message)
//       } else {
//         // console.log(data); // Handle success (e.g., update UI or show success message)
//         setCategoryName(""); // Clear the input field
//         setShowInput(false)
//         notify(data.message)
//         fetchCategories()
//         setError(""); // Clear error
//         toggleInput();
//       }
//     } catch (error) {
//       console.error("Error creating category:", error); // Handle error (e.g., show error message)
//       notify(error)
//     }
//   };

//   const handleToggleCategory = async (categoryId, isEnabled) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/activity/toggleCategory/${categoryId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isEnabled: !isEnabled }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         notify(data.message);
//       } else {
//         notify(data.message);
//         fetchCategories();
//       }
//     } catch (error) {
//       console.error("Error toggling category:", error);
//       notify("Failed to toggle category");
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       // console.log("ye hai data", data)
//       if (response.ok) {
//         if (data.length > 0) {

//           // Sort categories alphabetically by name
//           const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
//           setCategories(sortedCategories);
//         }
//         else {
//           notify(data.message);
//         }
//       }
//       else {
//         notify(data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       notify(error);
//     }
//   };

//   const checkTokenExpiry = async (token) => {
//     try {
//       const response = await fetch(`${API_URL}/activity/profile`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       // console.log("ye rha response", response)

//       if (!response.ok) {
//         // Token might be expired or invalid, so log the user out
//         // handleLogout();
//         navigate("/login")
//         notify("Session time Out")
//       }
//     } catch (error) {
//       notify(error)
//       console.error("Error checking token expiry:", error);
//     }
//   };

//   useEffect(() => {
//     // Check if both token and user key are present in local storage
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");

//     // console.log("ye hai token ",token)

//     if (!token || !userKey) {
//       // Redirect to the login page if either token or user key is missing
//       navigate("/login");
//     } else {
//       // Fetch user data when component mounts
//       checkTokenExpiry(token);
//       fetchCategories(); // Fetch categories when component mounts
//     }

//     // You may also want to check the validity of the token here if needed

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // Empty dependency array ensures that this effect runs only once on mount

//   // console.log("ye hai posts", categories)

//   return (
//     <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
//       <div className=" relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
//         <div className="relative w-full flex flex-col items-center justify-center gap-1 ">

//           <div className="bg-white-A700 flex flex-row items-center justify-between p-3  shadow-bs3 w-full">
//             <div onClick={goback}>
//               <Img
//                 className="h-4 cursor-pointer"
//                 src={APP_PATH + "images/img_arrowleft.svg"}
//                 alt="arrowleft"
//               />
//             </div>
//             <Text
//               className="text-gray-900"
//               size="txtInterSemiBold17"
//             >
//               Manage Categories
//             </Text>
//             {
//               showinput ?

//                 <Button className="rounded-xl btn" key={0} onChange={() => { }}>
//                   <FontAwesomeIcon icon={faCircleXmark} className="text-[#546ef6] text-2xl " />
//                 </Button> :
//                 <Button className="rounded-xl " key={1} onClick={toggleinput}>
//                   <FontAwesomeIcon icon={faCirclePlus} className="text-[#546ef6] text-2xl " />
//                 </Button>
//             }
//           </div>

//           {showinput && (
//             <div ref={popUpRef} className="w-11/12 flex flex-col items-center justify-center absolute top-20  z-20">
//               <div className={`w-11/12 rounded-xl flex items-center justify-center gap-1 border-[1px] p-1 bg-white-A700/70 ${error ? 'border-[1px] border-red-500' : 'border-gray-500 shadow  shadow-black-900 '}`}>
//                 <input
//                   type="text"
//                   className="w-full rounded-xl outline-none border-0 bg-white-A700/70 "
//                   onChange={handleInputChange}
//                   value={categoryName}
//                 />
//                 <FontAwesomeIcon
//                   icon={faSquareCheck}
//                   className="text-[#546ef6] text-3xl"
//                   onClick={handleCreateCategory}
//                 />
//               </div>
//               {error && <small className="text-red-500 w-11/12  -pt-3 text-left">{error}</small>}
//             </div>

//           )}
//         </div>

//         <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-scroll ">

//           {categories.length > 0 ? (
//             categories.map((category) => (
//               <div key={category.id} className={`bg-gray-100 p-2 rounded-md w-full flex items-center justify-between overflow-hidden ${category.isEnabled ? 'border-2 border-green-300 shadow-green-glow' : ''}`}>
//                 <h1>{category.name}</h1>

//                 <Switch.Root
//                   className="SwitchRoot"
//                   checked={category.isEnabled}
//                   onCheckedChange={() => handleToggleCategory(category.id, category.isEnabled)}
//                 >
//                   <Switch.Thumb className="SwitchThumb" />
//                 </Switch.Root>

//                 {/* <Button className="rounded-xl" onClick={() => handleToggleCategory(category.id, category.isEnabled)}>
//                   {category.isEnabled ? "Disable" : "Enable"}
//                 </Button> */}
//               </div>
//             ))
//           ) : (
//             <div className="w-full h-auto flex items-center justify-center p-2">
//               <Img className="w-[80%] h-auto object-cover object-center" src="images/nopost.svg" alt="No posts available for endorsement" />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DesktopSixPage;




import React, { useEffect, useRef, useState } from "react";
import { Button, Img, Text } from "components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { API_URL, APP_PATH } from "Constant";
import * as Switch from '@radix-ui/react-switch';
import "./style.css";

const DesktopSixPage = () => {
  const notify = (e) => toast(String(e));
  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [creating, setCreating] = useState(false); // disable while creating
  const popUpRef = useRef(null);

  const goBack = () => navigate("/admin");

  // toggle open/close popup, reset only when closing
  const toggleInput = () => {
    setShowInput((s) => {
      const next = !s;
      if (!next) {
        setCategoryName("");
        setError("");
      }
      return next;
    });
  };

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
    setError("");
  };

  const handleClickOutside = (event) => {
    if (popUpRef.current && !popUpRef.current.contains(event.target)) {
      setShowInput(false);
      setCategoryName("");
      setError("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found while fetching categories.");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/activity/getCategoriesAdmin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      console.log("getCategoriesAdmin:", res.status, data);

      if (!res.ok) {
        const msg = data?.message || `Failed to fetch categories (${res.status})`;
        notify(msg);
        setCategories([]);
        return;
      }

      const arr = Array.isArray(data) ? data : Array.isArray(data?.categories) ? data.categories : Object.values(data || {}).find(v => Array.isArray(v)) || [];
      // sort by name if present
      setCategories(arr.slice().sort((a, b) => (a.name || "").localeCompare(b.name || "")));
    } catch (err) {
      console.error("Error fetching categories:", err);
      notify("Error fetching categories");
      setCategories([]);
    }
  };

  // --- FIXED create routine with robust logging & UI feedback ---
  const handleCreateCategory = async () => {
    const name = (categoryName || "").trim();

    // local validation
    if (!name) {
      setError("Category name is required");
      return;
    }
    if (name.length < 2) {
      setError("Category name too short");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        notify("Not authenticated — please login again");
        navigate("/login");
        setCreating(false);
        return;
      }

      // POST the payload
      const res = await fetch(`${API_URL}/activity/createCategory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      // read text first (handles JSON or plain text)
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      console.log("createCategory response:", res.status, data);

      if (!res.ok) {
        // server returned an error — try to show its message
        const message = (data && data.message) ? data.message : (typeof data === "string" ? data : `Create failed (${res.status})`);
        setError(message);
        notify(message);
        setCreating(false);
        return;
      }

      // Success path
      const successMsg = (data && data.message) ? data.message : "Category created";
      notify(successMsg);
      setCategoryName("");
      setShowInput(false);
      setError("");
      // refresh list to show newly created category
      await fetchCategories();
    } catch (err) {
      console.error("Network error creating category:", err);
      const msg = err?.message || "Network error";
      setError(msg);
      notify(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleCategory = async (categoryId, newChecked) => {
    // optimistic UI
    const prev = categories;
    setCategories(prevCats => prevCats.map(c => c.id === categoryId ? { ...c, isEnabled: newChecked } : c));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await fetch(`${API_URL}/activity/toggleCategory/${categoryId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isEnabled: newChecked }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      console.log("toggleCategory:", res.status, data);

      if (!res.ok) {
        notify(data?.message || `Failed to toggle (${res.status})`);
        setCategories(prev); // rollback
      } else {
        notify(data?.message || "Category updated");
        fetchCategories();
      }
    } catch (err) {
      console.error("Error toggling category:", err);
      notify("Failed to toggle category");
      setCategories(prev); // rollback
      fetchCategories();
    }
  };

  // on mount: check token and fetch categories
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");
    if (!token || !userKey) {
      navigate("/login");
      return;
    }
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen bg-white-A700 flex items-start justify-center p-5 sm:p-0">
      <div className="relative w-4/12 h-full sm:w-full md:w-3/4 lg:w-3/4 flex flex-col items-center justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
        <div className="relative w-full flex flex-col items-center justify-center gap-1">
          <div className="bg-white-A700 flex flex-row items-center justify-between p-3 shadow-bs3 w-full">
            <div onClick={goBack}>
              <Img className="h-4 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
            </div>
            <Text className="text-gray-900" size="txtInterSemiBold17">Manage Categories</Text>

            {showInput ? (
              <Button className="rounded-xl btn" onClick={() => { setShowInput(false); setCategoryName(""); setError(""); }}>
                <FontAwesomeIcon icon={faCircleXmark} className="text-[#546ef6] text-2xl" />
              </Button>
            ) : (
              <Button className="rounded-xl" onClick={toggleInput}>
                <FontAwesomeIcon icon={faCirclePlus} className="text-[#546ef6] text-2xl" />
              </Button>
            )}
          </div>

          {showInput && (
            <div ref={popUpRef} className="w-11/12 flex flex-col items-center justify-center absolute top-20 z-20">
              <div className={`w-11/12 rounded-xl flex items-center justify-center gap-1 border-[1px] p-1 bg-white-A700/70 ${error ? 'border-red-500' : 'border-gray-500 shadow'}`}>
                <input
                  type="text"
                  className="w-full rounded-xl outline-none border-0 bg-white-A700/70 px-3 py-2"
                  onChange={handleInputChange}
                  value={categoryName}
                  placeholder="Category name"
                  disabled={creating}
                />
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  className={`text-[#546ef6] text-3xl cursor-pointer ${creating ? 'opacity-50' : ''}`}
                  onClick={handleCreateCategory}
                />
              </div>
              {error && <small className="text-red-500 w-11/12 -pt-3 text-left">{error}</small>}
              {creating && <small className="text-gray-600 w-11/12 -pt-1 text-left">Creating category...</small>}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-auto pb-6">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className={`bg-gray-100 p-2 rounded-md w-full flex items-center justify-between overflow-hidden ${category.isEnabled ? 'border-2 border-green-300 shadow-green-glow' : ''}`}>
                <h1 className="text-base">{category.name}</h1>

                <Switch.Root
                  className="SwitchRoot"
                  checked={Boolean(category.isEnabled)}
                  onCheckedChange={(checked) => handleToggleCategory(category.id, checked)}
                >
                  <Switch.Thumb className="SwitchThumb" />
                </Switch.Root>
              </div>
            ))
          ) : (
            <div className="w-full h-auto flex items-center justify-center p-2">
              <Img className="w-[80%] h-auto object-cover object-center" src={APP_PATH + "images/nopost.svg"} alt="No categories available" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopSixPage;







// import React, { useEffect, useRef, useState } from "react";
// import { Button, Img, Text } from "components";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCirclePlus, faCircleXmark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import { API_URL, APP_PATH } from "Constant";
// import * as Switch from '@radix-ui/react-switch';
// import "./style.css";

// const DesktopSixPage = () => {
//   const notify = (e) => toast(String(e));
//   const navigate = useNavigate();

//   const [showInput, setShowInput] = useState(false);
//   const [categoryName, setCategoryName] = useState("");
//   const [error, setError] = useState("");
//   const [categories, setCategories] = useState([]);
//   const popUpRef = useRef(null);

//   const goBack = () => navigate("/admin");

//   // Toggle popup & reset fields when closing
//   const toggleInput = () => {
//     setShowInput((s) => {
//       const next = !s;
//       if (!next) {
//         setCategoryName("");
//         setError("");
//       }
//       return next;
//     });
//   };

//   const handleInputChange = (e) => {
//     setCategoryName(e.target.value);
//     setError("");
//   };

//   const handleClickOutside = (event) => {
//     if (popUpRef.current && !popUpRef.current.contains(event.target)) {
//       setShowInput(false);
//       setCategoryName("");
//       setError("");
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.warn("No token found while fetching categories.");
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/activity/getCategoriesAdmin`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const text = await response.text();
//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         data = text;
//       }

//       console.log("getCategoriesAdmin response:", response.status, data);

//       if (!response.ok) {
//         const msg = data?.message || `Failed to fetch categories: ${response.status}`;
//         notify(msg);
//         setCategories([]);
//         return;
//       }

//       // Accept array directly or wrapped object
//       if (Array.isArray(data)) {
//         setCategories(sortCategories(data));
//       } else if (Array.isArray(data?.categories)) {
//         setCategories(sortCategories(data.categories));
//       } else {
//         const maybeArray = Object.values(data || {}).find((v) => Array.isArray(v));
//         setCategories(sortCategories(maybeArray || []));
//       }
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       notify("Error fetching categories");
//       setCategories([]);
//     }
//   };

//   const sortCategories = (arr) => {
//     try {
//       return arr.slice().sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//     } catch {
//       return arr;
//     }
//   };

//   const handleCreateCategory = async () => {
//     const name = (categoryName || "").trim();
//     if (!name) {
//       setError("Category name is required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/activity/createCategory`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name }),
//       });

//       const data = await response.json().catch(() => ({ message: "Invalid JSON from server" }));
//       console.log("createCategory response:", response.status, data);

//       if (!response.ok) {
//         setError(data.message || "Error creating category");
//         notify(data.message || "Error creating category");
//       } else {
//         setCategoryName("");
//         setShowInput(false);
//         setError("");
//         notify(data.message || "Category created");
//         fetchCategories();
//       }
//     } catch (err) {
//       console.error("Error creating category:", err);
//       notify(err.message || "Error creating category");
//       setError(err.message || "Error creating category");
//     }
//   };

//   const handleToggleCategory = async (categoryId, newChecked) => {
//     // optimistic update
//     const prev = categories;
//     setCategories((prevCats) => prevCats.map((c) => (c.id === categoryId ? { ...c, isEnabled: newChecked } : c)));

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       // If your API toggles server-side without body, remove the body and/or adjust accordingly.
//       const response = await fetch(`${API_URL}/activity/toggleCategory/${categoryId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isEnabled: newChecked }),
//       });

//       const data = await response.json().catch(() => ({ message: "Invalid JSON from server" }));
//       console.log("toggleCategory response:", response.status, data);

//       if (!response.ok) {
//         notify(data.message || "Failed to toggle category");
//         setCategories(prev); // rollback
//       } else {
//         notify(data.message || "Category updated");
//         fetchCategories();
//       }
//     } catch (err) {
//       console.error("Error toggling category:", err);
//       notify("Failed to toggle category");
//       setCategories(prev); // rollback
//       fetchCategories();
//     }
//   };

//   // Check session on mount and fetch categories
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");
//     if (!token || !userKey) {
//       navigate("/login");
//       return;
//     }
//     // optionally verify token validity with profile endpoint if you want
//     fetchCategories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="w-screen h-screen bg-white-A700 flex items-start justify-center p-5 sm:p-0">
//       <div className="relative w-4/12 h-full sm:w-full md:w-3/4 lg:w-3/4 flex flex-col items-center justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
//         <div className="relative w-full flex flex-col items-center justify-center gap-1">
//           <div className="bg-white-A700 flex flex-row items-center justify-between p-3 shadow-bs3 w-full">
//             <div onClick={goBack}>
//               <Img className="h-4 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
//             </div>
//             <Text className="text-gray-900" size="txtInterSemiBold17">Manage Categories</Text>

//             {showInput ? (
//               <Button className="rounded-xl btn" onClick={() => { setShowInput(false); setCategoryName(""); setError(""); }}>
//                 <FontAwesomeIcon icon={faCircleXmark} className="text-[#546ef6] text-2xl" />
//               </Button>
//             ) : (
//               <Button className="rounded-xl" onClick={toggleInput}>
//                 <FontAwesomeIcon icon={faCirclePlus} className="text-[#546ef6] text-2xl" />
//               </Button>
//             )}
//           </div>

//           {showInput && (
//             <div ref={popUpRef} className="w-11/12 flex flex-col items-center justify-center absolute top-20 z-20">
//               <div className={`w-11/12 rounded-xl flex items-center justify-center gap-1 border-[1px] p-1 bg-white-A700/70 ${error ? 'border-red-500' : 'border-gray-500 shadow'}`}>
//                 <input
//                   type="text"
//                   className="w-full rounded-xl outline-none border-0 bg-white-A700/70 px-3 py-2"
//                   onChange={handleInputChange}
//                   value={categoryName}
//                   placeholder="Category name"
//                 />
//                 <FontAwesomeIcon
//                   icon={faSquareCheck}
//                   className="text-[#546ef6] text-3xl cursor-pointer"
//                   onClick={handleCreateCategory}
//                 />
//               </div>
//               {error && <small className="text-red-500 w-11/12 -pt-3 text-left">{error}</small>}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-auto pb-6">
//           {categories && categories.length > 0 ? (
//             categories.map((category) => (
//               <div
//                 key={category.id}
//                 className={`bg-gray-100 p-2 rounded-md w-full flex items-center justify-between overflow-hidden ${category.isEnabled ? 'border-2 border-green-300 shadow-green-glow' : ''}`}
//               >
//                 <h1 className="text-base">{category.name}</h1>

//                 <Switch.Root
//                   className="SwitchRoot"
//                   checked={Boolean(category.isEnabled)}
//                   onCheckedChange={(checked) => handleToggleCategory(category.id, checked)}
//                   aria-label={`Toggle ${category.name}`}
//                 >
//                   <Switch.Thumb className="SwitchThumb" />
//                 </Switch.Root>
//               </div>
//             ))
//           ) : (
//             <div className="w-full h-auto flex items-center justify-center p-2">
//               <Img className="w-[80%] h-auto object-cover object-center" src={APP_PATH + "images/nopost.svg"} alt="No categories available" />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DesktopSixPage;
