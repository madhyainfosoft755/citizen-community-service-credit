import React, { useEffect, useState } from "react";
import { Button, Input, Text } from "components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { API_URL } from "Constant";

const OrganizationManagementPage = () => {
  const notify = (e) => toast(e);
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [organizations, setOrganizations] = useState([]);

  const goBack = () => {
    navigate("/admin");
  };

  const toggleInput = () => {
    setShowInput(!showInput);
  };

  const handleInputChange = (e) => {
    setOrganizationName(e.target.value);
    setError("");
  };

  const handleCreateOrganization = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/createOrganization`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: organizationName }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        notify(data.message);
      } else {
        setOrganizationName("");
        setShowInput(false);
        notify(data.message);
        fetchOrganizations();
        setError("");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      notify(error.message);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/getOrganizationsAdmin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrganizations(data);
      } else {
        notify(data.message);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      notify("Error fetching organizations");
    }
  };

  const toggleOrganization = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/activity/toggleOrganization/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        notify(data.message);
        fetchOrganizations();
      } else {
        notify(data.message);
      }
    } catch (error) {
      console.error("Error toggling organization:", error);
      notify("Error toggling organization");
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
  }, [navigate]);

  return (
    <div className="w-screen h-screen  bg-white-A700 flex items-start justify-center sm:w-screen sm:h-screen md:w-screen md:h-screen p-5 sm:p-0">
      <div className="relative w-4/12 h-full sm:w-full sm:h-full md:w-3/4 md:h-full  lg:w-3/4 lg:h-full  flex flex-col items-center  justify-start gap-5 border-[1px] rounded-lg sm:rounded-none overflow-hidden">
        <div className="relative w-full flex flex-col items-center justify-center gap-1 ">
          <div className="bg-white-A700 flex flex-row items-center justify-between p-3  shadow-bs3 w-full">
            <div onClick={goBack}>
              <img className="h-4 cursor-pointer" src="images/img_arrowleft.svg" alt="arrowleft" />
            </div>
            <Text className="text-gray-900" size="txtInterSemiBold17">
              Manage Organizations
            </Text>
            <Button className="rounded-xl" onClick={toggleInput}>
              <FontAwesomeIcon icon={showInput ? faCircleXmark : faCirclePlus} className="text-[#546ef6] text-2xl" />
            </Button>
          </div>

          {showInput && (
            <div className="w-11/12 flex flex-col items-center justify-center absolute top-20">
              <div className={`w-11/12 rounded-xl flex items-center justify-center gap-1 border-[1px] p-1 bg-white-A700 ${error ? 'border-[1px] border-red-500' : 'border-gray-500 shadow shadow-black-900'}`}>
                <input
                  type="text"
                  className="w-4/5 rounded-xl outline-none border-0"
                  onChange={handleInputChange}
                  value={organizationName}
                />
                <FontAwesomeIcon
                  icon={faSquareCheck}
                  className="text-[#546ef6] text-3xl"
                  onClick={handleCreateOrganization}
                />
              </div>
              {error && <small className="text-red-500 w-11/12 -pt-3 text-left">{error}</small>}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 items-center justify-start w-11/12 scroller overflow-scroll ">
          {organizations && organizations.length > 0 ? (
            organizations.map((organization) => (
              <div key={organization.id} className="bg-gray-100 p-2 rounded-md w-full flex items-center justify-between">
                <h1>{organization.name}</h1>
                <Button className="rounded-xl" onClick={() => toggleOrganization(organization.id)}>
                  {organization.isEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            ))
          ) : (
            <div className="w-full h-auto flex items-center justify-center p-2">
              <img className="w-[80%] h-auto object-cover object-center" src="images/nopost.svg" alt="No organizations available" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationManagementPage;