import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useShopStore } from "../store/Shop.store";

const FeaturedTailorsCarousel = () => {
  const { tailors, isLoading, error, fetchTailors } = useShopStore();

  useEffect(() => {
    fetchTailors();
  }, [fetchTailors]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {tailors.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold text-center mt-8 mb-6">
            Featured Tailor Shops
          </h2>
          <Slider {...settings}>
            {tailors.map((tailor, index) => (
              <div key={index} className="p-4">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
                  <img
                    src={tailor.logoUrl}
                    alt={tailor.shopName}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-ms font-semibold">{tailor.name}</h3>
                    <p className="text-gray-600 text-xs">
                      {tailor.shopAddress}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </>
      ) : (
        <div className="text-center"></div>
      )}
    </div>
  );
};

export default FeaturedTailorsCarousel;
