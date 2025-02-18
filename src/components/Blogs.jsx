import { ChevronRight } from "lucide-react";
import React from "react";
import { CustomButton } from "./ui/Button";

const BlogSection = () => {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Explore Our Blogs
      </h2>
      <p className="m-8 text-sm text-gray-600 dark:text-gray-300 max-w-lg">
        Discover the latest fashion trends, tailoring tips, and custom design
        inspirations. Stay updated with expert advice on how to style your
        outfits, maintain your wardrobe, and make the most out of your
        custom-made garments. Our blog also features interviews with top
        designers and tailors, giving you an inside look into the world of
        fashion.
      </p>
      <CustomButton
        text="Read More"
        color="primary"
        hover_color="hoverAccent"
        variant="filled"
        width="w-36"
        height="h-9"
        type="submit"
        onClick={() => console.log("Button Clicked")}
        iconRight={<ChevronRight />}
      />
    </div>
  );
};

export default BlogSection;
