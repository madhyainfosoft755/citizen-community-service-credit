import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./edit-model.css";
import { API_URL } from "Constant";

const EditUserModal = ({ userData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || "",
    organization: userData.organization || "",
    selectedCategories: userData.category || [],
    photo: userData.photo || "", // Added photo to formData
  });

  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allOrganisations, setAllOrganisations] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State for selected photo

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        address: userData.address || "",
        organization: userData.organization || "",
        selectedCategories: userData.category || [],
        photo: userData.photo || "", // Initialize photo from userData
      });

      setCategories(
        JSON.parse(userData.category).map((value) => ({
          value,
          label: value,
        }))
      );
    }
  }, [userData]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${API_URL}/activity/getOrganizations`);
        const data = await response.json();
        if (response.ok) {
          setAllOrganisations(
            Array.isArray(data)
              ? data.map((value) => ({
                  value: value.name,
                  label: value.name,
                }))
              : []
          );
        } else {
          console.error("Error fetching organizations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/activity/getCategories`);
        const data = await response.json();
        if (response.ok) {
          setAllCategories(
            data.map((value) => ({
              value: value.name,
              label: value.name,
            }))
          );
        } else {
          console.error("Error fetching categories:", data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    fetchOrganizations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedCategories) => {
    if (selectedCategories.length > 6) {
      setError({
        field: "category",
        message: "You can select a maximum of 6 categories.",
      });
      return;
    }
    setCategories(selectedCategories);
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedCategories: selectedCategories.map((cat) => cat.value),
    }));
    setError(null); // Clear error when selection is valid
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        photo: file,
      }));
      setSelectedPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.trim().length < 2) {
      setError({
        field: "name",
        message: "Name must be at least 2 characters long.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      // Uncomment this line if you want to navigate to the login page
      // navigate("/login");
      return;
    }

    const formDataWithPhoto = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "selectedCategories") {
        formDataWithPhoto.append(key, JSON.stringify(value));
      } else {
        formDataWithPhoto.append(key, value);
      }
    });

    try {
      const response = await fetch(`${API_URL}/activity/update-user`, {
        method: "POST",
        body: formDataWithPhoto,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ field: data.field, message: data.message });
        return;
      }

      if (data.status === "success") {
        setError(null);
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 pt-5 pb-8 border w-96 px-5 shadow-lg rounded-lg bg-[#ffffff]">
        <form onSubmit={handleSubmit}>
          <div className="text-center text-xl font-bold mb-4">
            Edit User Details
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => {
                if (formData.name.length < 2) {
                  setError({ field: "name", message: "Name must be at least 2 characters long." });
                }
              }}
              onFocus={() => {
                if (error && error.field === "name") {
                  setError(null); // Clear the error when the user focuses on the input
                }
              }}
              required
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && error.field === "name" && (
              <Alert message={error.message} onClose={() => setError(null)} />
            )}
          </div>


          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && error.field === "email" && (
              <Alert message={error.message} onClose={() => setError(null)} />
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && error.field === "phone" && (
              <Alert message={error.message} onClose={() => setError(null)} />
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {error && error.field === "address" && (
              <Alert message={error.message} onClose={() => setError(null)} />
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="photo"
            >
              Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <div className="mt-2">
              <img
                src={selectedPhoto || `${API_URL}/image/${userData.photo}`}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          </div>
          <div className="mb-8">
            <label htmlFor="category">Select Categories </label>
            <Select
              isMulti
              name="categories"
              options={allCategories}
              className="basic-multi-select"
              classNamePrefix="select"
              id="category"
              value={categories}
              onChange={handleCategoryChange}
            />
            {error && error.field === "category" && (
              <Alert message={error.message} onClose={() => setError(null)} />
            )}
          </div>
          <div className="mb-8">
            <label
              htmlFor="organization"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Organization
            </label>
            <Select
              name="organization"
              options={allOrganisations}
              className="basic-select"
              classNamePrefix="select"
              id="organization"
              value={
                formData.organization
                  ? { value: formData.organization, label: formData.organization }
                  : null
              }
              onChange={(selectedOption) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  organization: selectedOption ? selectedOption.value : "",
                }))
              }
            />
            {error && error.field === "organization" && (
              <Alert message={error.message} onClose={() => setError(null)} />
            )}
          </div>
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              Changes saved successfully!
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setSuccess(false)}
              >
                <svg
                  className="fill-current h-6 w-6 text-green-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.698-1.697L10 8.183l2.651-3.029a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.758 3.152a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Alert = ({ message, onClose }) => (
  <div
    className="bg-red-50 px-4 text-sm text-red-500 rounded relative flex mb-3"
    role="alert"
  >
    <span className="block sm:inline py-2 text-xs">{message}</span>
    <span className="px-2 py-2" onClick={onClose}>
      <svg
        className="fill-current h-3.5 w-3.5 text-red-500 text-xs"
        role="button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <title>Close</title>
        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.698-1.697L10 8.183l2.651-3.029a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.758 3.152a1.2 1.2 0 0 1 0 1.698z" />
      </svg>
    </span>
  </div>
);

export default EditUserModal;
