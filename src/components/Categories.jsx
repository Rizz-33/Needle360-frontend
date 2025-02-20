import React from "react";

const Categories = () => {
  const categories = [
    { id: 1, name: "Shirts", image: "/logo-black-full.png" },
    { id: 2, name: "Pants", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Dresses", image: "https://via.placeholder.com/150" },
    { id: 4, name: "Shoes", image: "https://via.placeholder.com/150" },
    { id: 5, name: "Hats", image: "https://via.placeholder.com/150" },
    { id: 6, name: "Jackets", image: "https://via.placeholder.com/150" },
    { id: 7, name: "Accessories", image: "https://via.placeholder.com/150" },
    { id: 8, name: "Swimwear", image: "https://via.placeholder.com/150" },
  ];

  const handleCategoryClick = (categoryId) => {
    console.log(`Category clicked: ${categoryId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-8 p-4 min-w-max">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative cursor-pointer w-24 h-24 bg-primary bg-opacity-5 rounded-full flex items-center justify-center transition-all duration-300 hover:w-32 hover:h-32 hover:bg-white hover:shadow-xl overflow-hidden border-2 border-secondary"
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Category Name (Initially Visible, Hides on Hover) */}
            <span className="absolute text-xs font-semibold opacity-100 transition-opacity duration-300 hover:opacity-0">
              {category.name}
            </span>

            {/* Image on Hover */}
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
