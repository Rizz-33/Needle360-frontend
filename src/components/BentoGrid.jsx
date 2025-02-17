import React from "react";

const BentoGrid = () => {
  const cards = [
    {
      title: "The Dawn of Innovation",
      description: "Explore the birth of groundbreaking ideas and inventions.",
      className: "col-span-1 row-span-1",
    },
    {
      title: "The Digital Revolution",
      description: "Dive into the transformative power of technology.",
      className: "col-span-1 row-span-1",
    },
    {
      title: "The Art of Design",
      description: "Discover the beauty of thoughtful and functional design.",
      className: "col-span-1 row-span-1",
    },
    {
      title: "The Power of Communication",
      description:
        "Understand the impact of effective communication in our lives.",
      className: "col-span-2 row-span-1",
    },
    {
      title: "The Pursuit of Knowledge",
      description: "Join the quest for understanding and enlightenment.",
      className: "col-span-1 row-span-1",
    },
    {
      title: "The Joy of Creation",
      description: "Experience the thrill of bringing ideas to life.",
      className: "col-span-1 row-span-1",
    },
    {
      title: "The Spirit of Adventure",
      description: "Embark on exciting journeys and thrilling discoveries.",
      className: "col-span-2 row-span-1",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.className} relative group rounded-3xl bg-gray-100 p-4 transition-all duration-300 hover:transform hover:scale-[1.02]`}
          >
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
