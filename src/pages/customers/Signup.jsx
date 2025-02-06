import React, { useState } from "react";

const InputField = ({ type, name, placeholder, value, onChange, required }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-2 pl-4 pr-4 border rounded-full text-xs"
    required={required}
  />
);

const SelectField = ({ name, value, onChange, options, required }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full p-2 pl-4 pr-4 border rounded-full text-xs"
    required={required}
  >
    <option value="">{`Select your ${name}`}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    country: "",
    province: "",
    city: "",
    postalCode: "",
    streetAddress: "",
    bankDetails: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
    <div className="flex w-full h-screen overflow-auto">
      <div className="w-1/2 hidden md:block">
        <img
          src="path/to/your/image.jpg"
          alt="Signup"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white pt-12 pb-12">
        <div className="rounded-full-lg p-8 w-full max-w-lg">
          <h2 className="text-sm font-bold text-left text-primary">
            Looking for the perfect fit? Find a tailor that meets your needs.
          </h2>
          <h2 className="text-xs font-extralight text-left mb-9">
            Sign up to browse profiles of expert tailors, view reviews, and book
            appointments for your custom tailoring needs.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <InputField
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <InputField
                type="password"
                name="password"
                placeholder="Set a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <InputField
                type="password"
                name="confirmPassword"
                placeholder="Confirm the password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <InputField
              type="tel"
              name="contactNumber"
              placeholder="Enter your contact number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <SelectField
                name="country"
                value={formData.country}
                onChange={handleChange}
                options={["Country1", "Country2"]}
                required
              />
              <SelectField
                name="province"
                value={formData.province}
                onChange={handleChange}
                options={["Province1", "Province2"]}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InputField
                type="text"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <InputField
                type="text"
                name="postalCode"
                placeholder="Enter your postal code"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <InputField
              type="text"
              name="streetAddress"
              placeholder="Enter your street address"
              value={formData.streetAddress}
              onChange={handleChange}
              required
            />

            <InputField
              type="text"
              name="bankDetails"
              placeholder="Enter your bank details"
              value={formData.bankDetails}
              onChange={handleChange}
              required
            />

            <div className="p-2" />

            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded-full hover:bg-secondary transition duration-300 text-xs"
            >
              Get Started
            </button>

            <div className="text-center mt-2">
              <p className="text-xs">
                Already have an account?{" "}
                <a href="/login" className="text-primary hover:underline">
                  Login
                </a>
              </p>
            </div>
          </form>

          <div className="m-5 border-b border-gray-200" />

          <div className="text-center mt-2">
            <p className="text-xs">
              By signing up, you agree to our{" "}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs">
              Tailor shop?{" "}
              <a href="/tailor-signup" className="text-primary hover:underline">
                Request to sign up as a Tailor Shop
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
