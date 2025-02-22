import React from "react";
import { FaShoppingBag } from "react-icons/fa";
import { CustomButton } from "./Button";

const ProductCard = ({
  image,
  name,
  description,
  price,
  rating,
  category,
  availability,
}) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 ease-in-out p-4">
      {/* Card Image */}
      <div className="relative">
        <img
          className="w-full h-64 object-cover rounded-t-lg"
          src={image}
          alt={name}
        />
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
          {availability ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>

        {/* Product Description */}
        <p className="text-gray-600 text-xs mb-2 line-clamp-3">{description}</p>

        {/* Category */}
        <div className="text-gray-500 text-xs uppercase mb-1">{category}</div>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }, (_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              fill={index < rating ? "gold" : "gray"}
              viewBox="0 0 24 24"
              className="w-4 h-4"
            >
              <path d="M12 17.27l4.18 2.73-1.64-5.09L20 9.24h-5.19L12 4.75 9.19 9.24H4l3.46 5.67-1.64 5.09L12 17.27z" />
            </svg>
          ))}
          <span className="ml-2 text-gray-500 text-xs">({rating}.0)</span>
        </div>

        {/* Estimated Price */}
        <div className="text-sm font-semibold text-gray-800 mb-2">{`$${price}`}</div>

        <CustomButton
          text="Add to Bag"
          color="primary"
          hover_color="hoverAccent"
          variant="outlined"
          width="w-full"
          height="h-9"
          type="submit"
          iconRight={<FaShoppingBag className="w-3 h-3 mx-4" />}
        />
      </div>
    </div>
  );
};

export default ProductCard;
