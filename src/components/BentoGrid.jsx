import React from "react";

const BentoGrid = () => {
  const cards = [
    {
      title: "Who We Are",
      description:
        "A tailor shop network revolutionizing custom fashion in Sri Lanka.",
      className: "col-span-1 row-span-1 bg-[#F0F0FF]",
      image: "/images/who-we-are.svg",
    },
    {
      title: "Our Mission",
      description:
        "Empowering tailors and customers with a seamless online platform for customized clothing.",
      className: "col-span-1 row-span-1 bg-[#E8E8FF]",
    },
    {
      title: "Order Management",
      description:
        "Enabling tailor shops to manage, track, and fulfill customer orders efficiently.",
      className: "col-span-1 row-span-1 bg-[#D8D8FF]",
      image: "/images/order-management.svg",
    },
    {
      title: "Design & Customization",
      description:
        "Customers can design garments, get feedback, and connect with the right tailor shop.",
      className: "col-span-2 row-span-1 bg-[#E8E8FF]",
      image: "/images/design-customization.svg",
    },
    {
      title: "Tailor Shop Network",
      description:
        "Multiple tailor shops can register, receive orders, and grow their business online.",
      className: "col-span-1 row-span-1 bg-[#F0F0FF]",
    },
    {
      title: "Customer Creativity",
      description:
        "Customers can upload clothing ideas and receive tailor recommendations.",
      className: "col-span-1 row-span-1 bg-[#F8F8FF]",
    },
    {
      title: "A Unique Platform",
      description:
        "Pioneering a tailor shop-focused e-commerce experience in Sri Lanka.",
      className: "col-span-2 row-span-1 bg-[#D8D8FF]",
      image: "/images/a-unique-platform.svg",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.className} relative group rounded-3xl p-4 transition-all duration-300 hover:transform hover:scale-[1.02]`}
          >
            {card.image && (
              <img
                src={card.image}
                alt={card.title}
                className="absolute top-4 right-4 w-16 h-16 opacity-50"
              />
            )}
            <div className="relative h-full flex flex-col justify-end">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-700">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BentoGrid;
