// import React, { useEffect, useRef, useState } from "react";
// import { Button, Input, Text } from "components";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCirclePlus, faCircleXmark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import { API_URL, APP_PATH } from "Constant";
// import * as Switch from '@radix-ui/react-switch';
// import "./style.css"

// const OrganizationManagementPage = () => {
//   const notify = (e) => toast(e);
//   const navigate = useNavigate();
//   const [showInput, setShowInput] = useState(false);
//   const [organizationName, setOrganizationName] = useState("");
//   const [error, setError] = useState("");
//   const [organizations, setOrganizations] = useState([]);
//   const popUpRef = useRef(null); // Create a ref for the pop-up

//   const goBack = () => {
//     navigate("/admin");
//   };

//   const toggleInput = () => {
//     setShowInput(!showInput);
//     if (showInput) {
//       setOrganizationName("");
//       setError("");
//     }
//   };

//   const handleInputChange = (e) => {
//     setOrganizationName(e.target.value);
//     setError("");
//   };

//   const handleClickOutside = (event) => {
//     if (popUpRef.current && !popUpRef.current.contains(event.target)) {
//       setShowInput(false); // Close the pop-up if click is outside it
//       setError("")
//       setOrganizationName("")
//       // console.log("2",event.target)
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside); // Attach event listener on mount
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside); // Detach event listener on unmount
//     };
//   }, []); // Empty dependency array ensures that this effect runs only once on mount


//   const handleCreateOrganization = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/activity/createOrganization`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: organizationName }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         setError(data.message);
//         notify(data.message);
//       } else {
//         setOrganizationName("");
//         setShowInput(false);
//         notify(data.message);
//         fetchOrganizations();
//         setError("");
//       }
//     } catch (error) {
//       console.error("Error creating organization:", error);
//       notify(error.message);
//     }
//   };

//   const fetchOrganizations = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/activity/getOrganizationsAdmin`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setOrganizations(data);
//       } else {
//         notify(data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching organizations:", error);
//       notify("Error fetching organizations");
//     }
//   };

//   const toggleOrganization = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_URL}/activity/toggleOrganization/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         notify(data.message);
//         fetchOrganizations();
//       } else {
//         notify(data.message);
//       }
//     } catch (error) {
//       console.error("Error toggling organization:", error);
//       notify("Error toggling organization");
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");

//     if (!token || !userKey) {
//       navigate("/login");
//     } else {
//       fetchOrganizations();
//     }
//   }, [navigate]);


//   return (
//     <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
//       <div className="relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
//         <div className="relative w-full flex flex-col items-center justify-center gap-1 ">
//           <div className="bg-white-A700 flex flex-row items-center justify-between p-3  shadow-bs3 w-full">
//             <div onClick={goBack}>
//               <img className="h-4 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
//             </div>
//             <Text className="text-gray-900" size="txtInterSemiBold17">
//               Manage Organizations
//             </Text>
//             {
//               showInput ?

//                 <Button className="rounded-xl btn" key={0} onChange={() => { }}>
//                   <FontAwesomeIcon icon={faCircleXmark} className="text-[#546ef6] text-2xl " />
//                 </Button> :
//                 <Button className="rounded-xl " key={1} onClick={toggleInput}>
//                   <FontAwesomeIcon icon={faCirclePlus} className="text-[#546ef6] text-2xl " />
//                 </Button>
//             }
//           </div>

//           {showInput && (
//             <div ref={popUpRef} className="w-11/12 flex flex-col items-center justify-center absolute top-20 z-20">
//               <div className={`w-11/12 rounded-xl flex items-center justify-center gap-1 border-[1px] p-1 bg-white-A700/70 ${error ? 'border-[1px] border-red-500' : 'border-gray-500 shadow shadow-black-900'}`}>
//                 <input
//                   type="text"
//                   className="w-full rounded-xl outline-none border-0 bg-white-A700/70"
//                   onChange={handleInputChange}
//                   value={organizationName}
//                 />
//                 <FontAwesomeIcon
//                   icon={faSquareCheck}
//                   className="text-[#546ef6] text-3xl"
//                   onClick={handleCreateOrganization}
//                 />
//               </div>
//               {error && <small className="text-red-500 w-11/12 -pt-3 text-left">{error}</small>}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-scroll ">
//           {organizations && organizations.length > 0 ? (
//             organizations.map((organization) => (
//               <div key={organization.id} className="bg-gray-100 p-2 rounded-md w-full flex items-center justify-between">
//                 <h1>{organization.name}</h1>
//                 <Switch.Root
//                   className="SwitchRoot"
//                   checked={organization.isEnabled}
//                   onCheckedChange={(checked) => toggleOrganization(organization.id, organization.isEnabled)}
//                 >
//                   <Switch.Thumb className="SwitchThumb" />
//                 </Switch.Root>
//               </div>
//             ))
//           ) : (
//             <div className="w-full h-auto flex items-center justify-center p-2">
//               <img className="w-[80%] h-auto object-cover object-center" src={APP_PATH + "images/nopost.svg"} alt="No organizations available" />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationManagementPage;




// import React, { useEffect, useRef, useState } from "react";
// import { Button, Text } from "components";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCirclePlus, faCircleXmark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";
// import { API_URL, APP_PATH } from "Constant";
// import * as Switch from '@radix-ui/react-switch';
// import "./style.css";

// const OrganizationManagementPage = () => {
//   const notify = (e) => toast(String(e));
//   const navigate = useNavigate();
//   const [showInput, setShowInput] = useState(false);
//   const [organizationName, setOrganizationName] = useState("");
//   const [error, setError] = useState("");
//   const [organizations, setOrganizations] = useState([]);
//   const popUpRef = useRef(null);

//   const goBack = () => {
//     navigate("/admin");
//   };

//   const toggleInput = () => {
//     // toggle and reset fields when closing
//     setShowInput((s) => {
//       const next = !s;
//       if (!next) {
//         setOrganizationName("");
//         setError("");
//       }
//       return next;
//     });
//   };

//   const handleInputChange = (e) => {
//     setOrganizationName(e.target.value);
//     setError("");
//   };

//   const handleClickOutside = (event) => {
//     if (popUpRef.current && !popUpRef.current.contains(event.target)) {
//       setShowInput(false);
//       setError("");
//       setOrganizationName("");
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const fetchOrganizations = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.warn("No token found in localStorage when fetching organizations.");
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/activity/getOrganizationsAdmin`, {
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
//       } catch (e) {
//         data = text;
//       }

//       console.log("getOrganizationsAdmin response:", response.status, data);

//       if (!response.ok) {
//         const msg = data?.message || `Failed to fetch organizations: ${response.status}`;
//         notify(msg);
//         setOrganizations([]);
//         return;
//       }

//       if (Array.isArray(data)) {
//         setOrganizations(data);
//       } else if (Array.isArray(data?.organizations)) {
//         setOrganizations(data.organizations);
//       } else {
//         // fallback: try to find any array inside the response
//         const maybeArray = Object.values(data || {}).find((v) => Array.isArray(v));
//         setOrganizations(maybeArray || []);
//       }
//     } catch (error) {
//       console.error("Error fetching organizations:", error);
//       notify("Error fetching organizations");
//       setOrganizations([]);
//     }
//   };

//   const handleCreateOrganization = async () => {
//     const name = (organizationName || "").trim();
//     if (!name) {
//       setError("Organization name is required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const response = await fetch(`${API_URL}/activity/createOrganization`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name }),
//       });

//       const data = await response.json().catch(() => ({ message: "Invalid JSON from server" }));
//       console.log("createOrganization response:", response.status, data);

//       if (!response.ok) {
//         setError(data.message || "Error creating organization");
//         notify(data.message || "Error creating organization");
//       } else {
//         setOrganizationName("");
//         setShowInput(false);
//         setError("");
//         notify(data.message || "Organization created");
//         // refresh list
//         fetchOrganizations();
//       }
//     } catch (error) {
//       console.error("Error creating organization:", error);
//       notify(error.message ?? "Error creating organization");
//       setError(error.message ?? "Error creating organization");
//     }
//   };

//   const toggleOrganization = async (id, newState) => {
//     // optimistic update
//     const prev = organizations;
//     setOrganizations((prevOrgs) => prevOrgs.map((o) => (o.id === id ? { ...o, isEnabled: newState } : o)));

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       // Adjust body depending on backend expectation. If backend toggles server-side without body, you may remove body.
//       const response = await fetch(`${API_URL}/activity/toggleOrganization/${id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isEnabled: newState }),
//       });

//       const data = await response.json().catch(() => ({ message: "Invalid JSON from server" }));
//       console.log("toggleOrganization response:", response.status, data);

//       if (!response.ok) {
//         notify(data.message || "Failed to toggle organization");
//         // rollback optimistic update
//         setOrganizations(prev);
//       } else {
//         notify(data.message || "Organization updated");
//         // refresh canonical state
//         fetchOrganizations();
//       }
//     } catch (error) {
//       console.error("Error toggling organization:", error);
//       notify("Error toggling organization");
//       // rollback optimistic update
//       setOrganizations(prev);
//       // attempt to refresh
//       fetchOrganizations();
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userKey = localStorage.getItem("userKey");

//     if (!token || !userKey) {
//       navigate("/login");
//     } else {
//       fetchOrganizations();
//     }
//     // we only want to run this on mount
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <div className="w-screen h-screen bg-white-A700 flex items-start justify-center p-5 sm:p-0">
//       <div className="relative w-4/12 h-full sm:w-full md:w-3/4 lg:w-3/4 flex flex-col items-center justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
//         <div className="relative w-full flex flex-col items-center justify-center gap-1 ">
//           <div className="bg-white-A700 flex flex-row items-center justify-between p-3 shadow-bs3 w-full">
//             <div onClick={goBack}>
//               <img className="h-4 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
//             </div>
//             <Text className="text-gray-900" size="txtInterSemiBold17">
//               Manage Organizations
//             </Text>
//             {showInput ? (
//               <Button className="rounded-xl btn" onClick={() => { setShowInput(false); setOrganizationName(""); setError(""); }}>
//                 <FontAwesomeIcon icon={faCircleXmark} className="text-[#546ef6] text-2xl " />
//               </Button>
//             ) : (
//               <Button className="rounded-xl " onClick={toggleInput}>
//                 <FontAwesomeIcon icon={faCirclePlus} className="text-[#546ef6] text-2xl " />
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
//                   value={organizationName}
//                   placeholder="Organization name"
//                 />
//                 <FontAwesomeIcon
//                   icon={faSquareCheck}
//                   className="text-[#546ef6] text-3xl cursor-pointer"
//                   onClick={handleCreateOrganization}
//                 />
//               </div>
//               {error && <small className="text-red-500 w-11/12 -pt-3 text-left">{error}</small>}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-auto pb-6">
//           {organizations && organizations.length > 0 ? (
//             organizations.map((organization) => (
//               <div key={organization.id} className="bg-gray-100 p-2 rounded-md w-full flex items-center justify-between">
//                 <h1 className="text-base font-medium">{organization.name}</h1>
//                 <Switch.Root
//                   className="SwitchRoot"
//                   checked={Boolean(organization.isEnabled)}
//                   onCheckedChange={(checked) => toggleOrganization(organization.id, checked)}
//                   aria-label={`Toggle ${organization.name}`}
//                 >
//                   <Switch.Thumb className="SwitchThumb" />
//                 </Switch.Root>
//               </div>
//             ))
//           ) : (
//             <div className="w-full h-auto flex items-center justify-center p-2">
//               <img className="w-[80%] h-auto object-cover object-center" src={APP_PATH + "images/nopost.svg"} alt="No organizations available" />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationManagementPage;





import React, { useEffect, useRef, useState } from "react";
import { Button, Text } from "components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { API_URL, APP_PATH } from "Constant";
import * as Switch from '@radix-ui/react-switch';
import "./style.css";

const OrganizationManagementPage = () => {
  const notify = (e) => toast(String(e));
  const navigate = useNavigate();

  // existing states
  const [showInput, setShowInput] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const popUpRef = useRef(null);

  // new states for required fields
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgRegNo, setOrgRegNo] = useState("");
  const [orgPassword, setOrgPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const goBack = () => navigate("/admin");

  const toggleInput = () => {
    setShowInput((s) => {
      const next = !s;
      if (!next) {
        // reset all fields when closing
        setOrganizationName("");
        setOrgEmail("");
        setOrgPhone("");
        setOrgAddress("");
        setOrgRegNo("");
        setOrgPassword("");
        setError("");
      }
      return next;
    });
  };

  const handleClickOutside = (event) => {
    if (popUpRef.current && !popUpRef.current.contains(event.target)) {
      setShowInput(false);
      setOrganizationName("");
      setOrgEmail("");
      setOrgPhone("");
      setOrgAddress("");
      setOrgRegNo("");
      setOrgPassword("");
      setError("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }

      const response = await fetch(`${API_URL}/activity/getOrganizationsAdmin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      console.log("getOrganizationsAdmin response:", response.status, data);

      if (!response.ok) {
        const msg = data?.message || `Failed to fetch organizations: ${response.status}`;
        notify(msg);
        setOrganizations([]);
        return;
      }

      if (Array.isArray(data)) setOrganizations(data);
      else if (Array.isArray(data?.organizations)) setOrganizations(data.organizations);
      else {
        const maybeArray = Object.values(data || {}).find((v) => Array.isArray(v));
        setOrganizations(maybeArray || []);
      }
    } catch (err) {
      console.error("Error fetching organizations:", err);
      notify("Error fetching organizations");
      setOrganizations([]);
    }
  };

  // basic validators
  const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const isValidPhone = (s) => /^\d{10}$/.test(s);

  const handleCreateOrganization = async () => {
    setError("");
    const name = (organizationName || "").trim();
    if (!name) {
      setError("Organization name is required");
      return;
    }

    // If backend requires all fields, validate presence (adjust as needed)
    if (!orgEmail) {
      setError("Email is required");
      return;
    }
    if (!isValidEmail(orgEmail)) {
      setError("Invalid email format");
      return;
    }
    if (!orgPhone) {
      setError("Phone is required");
      return;
    }
    if (!isValidPhone(orgPhone)) {
      setError("Phone must be 10 digits");
      return;
    }
    if (!orgAddress) {
      setError("Address is required");
      return;
    }
    if (!orgRegNo) {
      setError("Registration number is required");
      return;
    }
    // password optional; backend will handle hashing if required

    setCreating(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); setCreating(false); return; }

      const payload = {
        name,
        email: orgEmail,
        phone: orgPhone,
        address: orgAddress,
        registration_number: orgRegNo,
        password: orgPassword || undefined, // optional
      };

      const response = await fetch(`${API_URL}/activity/createOrganization`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      console.log("createOrganization response:", response.status, data);

      if (!response.ok) {
        const msg = data?.message || (typeof data === "string" ? data : `Create failed (${response.status})`);
        setError(msg);
        notify(msg);
        setCreating(false);
        return;
      }

      notify(data.message || "Organization created");
      // reset and close popup
      setOrganizationName("");
      setOrgEmail("");
      setOrgPhone("");
      setOrgAddress("");
      setOrgRegNo("");
      setOrgPassword("");
      setShowInput(false);
      setError("");
      // refresh list
      fetchOrganizations();
    } catch (err) {
      console.error("Error creating organization:", err);
      const msg = err?.message || "Network error creating organization";
      setError(msg);
      notify(msg);
    } finally {
      setCreating(false);
    }
  };

  const toggleOrganization = async (id, newState) => {
    const prev = organizations;
    setOrganizations((prevOrgs) => prevOrgs.map((o) => (o.id === id ? { ...o, isEnabled: newState } : o)));

    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }

      const response = await fetch(`${API_URL}/activity/toggleOrganization/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isEnabled: newState }),
      });

      const data = await response.json().catch(() => ({ message: "Invalid JSON from server" }));
      console.log("toggleOrganization response:", response.status, data);

      if (!response.ok) {
        notify(data.message || "Failed to toggle organization");
        setOrganizations(prev); // rollback
      } else {
        notify(data.message || "Organization updated");
        fetchOrganizations();
      }
    } catch (err) {
      console.error("Error toggling organization:", err);
      notify("Error toggling organization");
      setOrganizations(prev); // rollback
      fetchOrganizations();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("userKey");
    if (!token || !userKey) {
      navigate("/login");
    } else {
      fetchOrganizations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen bg-white-A700 flex items-start justify-center p-5 sm:p-0">
      <div className="relative w-4/12 h-full sm:w-full md:w-3/4 lg:w-3/4 flex flex-col items-center justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
        <div className="relative w-full flex flex-col items-center justify-center gap-1 ">
          <div className="bg-white-A700 flex flex-row items-center justify-between p-3 shadow-bs3 w-full">
            <div onClick={goBack}>
              <img className="h-4 cursor-pointer" src={APP_PATH + "images/img_arrowleft.svg"} alt="arrowleft" />
            </div>
            <Text className="text-gray-900" size="txtInterSemiBold17">
              Manage Organizations
            </Text>
            {showInput ? (
              <Button className="rounded-xl btn" onClick={() => { setShowInput(false); setOrganizationName(""); setError(""); setOrgEmail(""); setOrgPhone(""); setOrgAddress(""); setOrgRegNo(""); setOrgPassword(""); }}>
                <FontAwesomeIcon icon={faCircleXmark} className="text-[#546ef6] text-2xl " />
              </Button>
            ) : (
              <Button className="rounded-xl " onClick={toggleInput}>
                <FontAwesomeIcon icon={faCirclePlus} className="text-[#546ef6] text-2xl " />
              </Button>
            )}
          </div>

          {showInput && (
            <div ref={popUpRef} className="w-11/12 flex flex-col items-center justify-center absolute top-20 z-20">
              <div className="w-11/12 rounded-xl bg-white p-4 shadow">
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="text"
                    placeholder="Organization name"
                    className="w-full p-2 border rounded"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    disabled={creating}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    disabled={creating}
                  />
                  <input
                    type="text"
                    placeholder="Phone (10 digits)"
                    className="w-full p-2 border rounded"
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value.replace(/\D/g, ""))}
                    disabled={creating}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full p-2 border rounded"
                    value={orgAddress}
                    onChange={(e) => setOrgAddress(e.target.value)}
                    disabled={creating}
                  />
                  <input
                    type="text"
                    placeholder="Registration number"
                    className="w-full p-2 border rounded"
                    value={orgRegNo}
                    onChange={(e) => setOrgRegNo(e.target.value)}
                    disabled={creating}
                  />
                  <input
                    type="password"
                    placeholder="Password (optional)"
                    className="w-full p-2 border rounded"
                    value={orgPassword}
                    onChange={(e) => setOrgPassword(e.target.value)}
                    disabled={creating}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => {
                      setShowInput(false);
                      setOrganizationName("");
                      setOrgEmail("");
                      setOrgPhone("");
                      setOrgAddress("");
                      setOrgRegNo("");
                      setOrgPassword("");
                      setError("");
                    }}
                    className="px-4 py-2 rounded border"
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateOrganization}
                    className={`px-4 py-2 rounded bg-[#546ef6] text-white ${creating ? "opacity-60 cursor-not-allowed" : ""}`}
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>

                {error && <div className="text-red-500 mt-2">{error}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-auto pb-6">
          {organizations && organizations.length > 0 ? (
            organizations.map((organization) => (
              <div key={organization.id} className="bg-gray-100 p-2 rounded-md w-full flex items-center justify-between">
                <h1 className="text-base font-medium">{organization.name}</h1>
                <Switch.Root
                  className="SwitchRoot"
                  checked={Boolean(organization.isEnabled)}
                  onCheckedChange={(checked) => toggleOrganization(organization.id, checked)}
                  aria-label={`Toggle ${organization.name}`}
                >
                  <Switch.Thumb className="SwitchThumb" />
                </Switch.Root>
              </div>
            ))
          ) : (
            <div className="w-full h-auto flex items-center justify-center p-2">
              <img className="w-[80%] h-auto object-cover object-center" src={APP_PATH + "images/nopost.svg"} alt="No organizations available" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationManagementPage;
