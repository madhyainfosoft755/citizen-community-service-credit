import React, { useEffect, useState } from "react";
import Select from "react-select";

import "./edit-model.css";

const EditUserModal = ({ userData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  });

  const [categories, setCategories] = useState(
    JSON.parse(userData.category).map((value) => {
      return { value: value, label: value };
    })
  );

  const [organisations, setOrganisations] = useState(
    userData.organisation &&
      JSON.parse(userData.organisation).map((value) => {
        return { value: value, label: value };
      })
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        address: userData.address || "",
        organisation: userData.organisation || "",
      });
    }
  }, [userData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 ">
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
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
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
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
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
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Address
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="category">Select Categories </label>

            <Select
              isMulti
              name="options"
              options={categories}
              className="basic-multi-select"
              classNamePrefix="select"
              id="category"
              value={categories}
              onChange={() => {}}
            />
          </div>
          <div className="mb-8">
            <label htmlFor="category">Organisation </label>

            <Select
              name="options"
              options={categories}
              className="basic-multi-select"
              classNamePrefix="select"
              id="organisation"
              value={organisations}
              onChange={() => {}}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#db5d52] hover:bg-red-700 text-[#ffffff] font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline rounded_border_button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#537cff] hover:bg-blue-700 text-[#ffffff] font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline rounded_border_button"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
