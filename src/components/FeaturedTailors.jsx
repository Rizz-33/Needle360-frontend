import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const FeaturedTailorsCarousel = () => {
  const tailors = [
    {
      name: "Elegant Stitches",
      image: "/images/tailor1.jpg",
      rating: "4.8",
    },
    {
      name: "Royal Threads",
      image: "/images/tailor2.jpg",
      rating: "4.7",
    },
    {
      name: "Urban Tailors",
      image: "/images/tailor3.jpg",
      rating: "4.9",
    },
    {
      name: "Classic Fits",
      image: "/images/tailor4.jpg",
      rating: "4.6",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Featured Tailor Shops
      </h2>
      <Slider {...settings}>
        {tailors.map((tailor, index) => (
          <div key={index} className="p-4">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <img
                src={tailor.image}
                alt={tailor.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold">{tailor.name}</h3>
                <p className="text-gray-600">⭐ {tailor.rating}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedTailorsCarousel;
