import {
  Globe,
  Package,
  PenTool,
  Ruler,
  Share2,
  Shirt,
  Users,
  ZoomIn,
} from "lucide-react";

export const bentoGridConfigs = [
  {
    title: "Who We Are",
    description:
      "A tailor shop network revolutionizing custom fashion in Sri Lanka.",
    className: "col-span-1 row-span-1 bg-[#F0F0FF]",
    icon: Users, // Icon for community/network
  },
  {
    title: "Our Mission",
    description:
      "Empowering tailors and customers with a seamless online platform for customized clothing.",
    className: "col-span-1 row-span-1 bg-[#E8E8FF]",
    // No icon or image (as per original)
  },
  {
    title: "Order Management",
    description:
      "Enabling tailor shops to manage, track, and fulfill customer orders efficiently.",
    className: "col-span-1 row-span-1 bg-[#D8D8FF]",
    icon: Package, // Icon for order processing
  },
  {
    title: "Design & Customization",
    description:
      "Customers can design garments, get feedback, and connect with the right tailor shop.",
    className: "col-span-2 row-span-1 bg-[#E8E8FF]",
    icon: Shirt, // Icon for clothing design
  },
  {
    title: "Tailor Shop Network",
    description:
      "Multiple tailor shops can register, receive orders, and grow their business online.",
    className: "col-span-1 row-span-1 bg-[#F0F0FF]",
    // No icon or image (as per original)
  },
  {
    title: "Customer Creativity",
    description:
      "Customers can upload clothing ideas and receive tailor recommendations.",
    className: "col-span-1 row-span-1 bg-[#F8F8FF]",
    // No icon or image (as per original)
  },
  {
    title: "A Unique Platform",
    description:
      "Pioneering a tailor shop-focused e-commerce experience in Sri Lanka.",
    className: "col-span-2 row-span-1 bg-[#D8D8FF]",
    icon: Globe, // Icon for unique/global platform
  },
];

export const howItWorksConfig = [
  {
    title: "Upload or Design",
    description:
      "Upload your design, create a new one, or customize an existing template. Use our intuitive design tools to bring your vision to life. Access a wide range of design elements and templates to make your creation unique.",
  },
  {
    title: "Choose Tailor",
    description:
      "Select tailors near you based on reviews, expertise, and location. Compare them to find the best match for your needs. View their portfolios and read customer testimonials to make an informed decision.",
  },
  {
    title: "Order and Get It Delivered",
    description:
      "Place your order and have your custom outfit crafted and delivered to your doorstep. Track your order in real-time and receive updates on the progress. Enjoy a seamless hassle-free experience with our reliable delivery service.",
  },
];

export const designFeatures = [
  {
    id: "customize",
    icon: PenTool,
    title: "Custom Design Tools",
    description:
      "Intuitive design interface with measurement tools and fabric selection",
  },
  {
    id: "collaborate",
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Work directly with tailors to perfect your design choices",
  },
  {
    id: "measure",
    icon: Ruler,
    title: "Smart Measurements",
    description: "AI-powered measurement suggestions and size recommendations",
  },
  {
    id: "preview",
    icon: ZoomIn,
    title: "3D Preview",
    description: "Virtual try-on technology to visualize your designs",
  },
];

export const predefinedServices = [
  "School Uniforms",
  "Saree Blouses",
  "Wedding Attire",
  "Office Wear",
  "National Dress",
  "Formal Wear",
  "Casual Wear",
  "Kidswear",
  "Religious/Cultural Outfits",
  "Custom Fashion Designs",
];
