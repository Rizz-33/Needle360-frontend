import {
  Code,
  Database,
  Globe,
  Layout,
  Lightbulb,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Palette,
  Phone,
  Rocket,
  Scissors,
  Share2,
  Shirt,
  Terminal,
  Truck,
  Users,
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

export const sdlcFeatures = [
  {
    id: "planning",
    title: "Planning",
    description:
      "Strategic roadmapping and requirement analysis for successful products",
    icon: Lightbulb,
  },
  {
    id: "development",
    title: "Development",
    description:
      "Clean, efficient code using modern frameworks and best practices",
    icon: Code,
  },
  {
    id: "testing",
    title: "Testing",
    description:
      "Comprehensive testing strategies to ensure quality and performance",
    icon: Terminal,
  },
  {
    id: "deployment",
    title: "Deployment",
    description:
      "Seamless deployment pipelines with CI/CD for reliable releases",
    icon: Rocket,
  },
];

export const contactMethods = [
  {
    id: "email",
    title: "Email",
    description: "Get in touch via email for project inquiries",
    icon: Mail,
  },
  {
    id: "phone",
    title: "Phone",
    description: "Speak directly about your project requirements",
    icon: Phone,
  },
  {
    id: "chat",
    title: "Live Chat",
    description: "Quick responses through our messaging platform",
    icon: MessageSquare,
  },
  {
    id: "visit",
    title: "Visit",
    description: "Schedule an in-person consultation at our office",
    icon: MapPin,
  },
];

export const aboutAppConfigs = [
  {
    title: "Who We Are",
    description:
      "A tailor shop network revolutionizing custom fashion in Sri Lanka.",
    expandedDetails:
      "We are a pioneering platform connecting tailor shops across Sri Lanka, enabling them to showcase their skills and reach a wider audience. Our network fosters collaboration, innovation, and growth in the custom fashion industry.",
    className: "col-span-1 row-span-1 bg-[#F0F0FF]",
    icon: Users,
  },
  {
    title: "Our Mission",
    description:
      "Empowering tailors and customers with a seamless online platform for customized clothing.",
    expandedDetails:
      "Our mission is to bridge the gap between tailors and customers by providing a user-friendly platform where creativity meets craftsmanship. We aim to empower both parties with tools for design, communication, and order fulfillment.",
    className: "col-span-1 row-span-1 bg-[#E8E8FF]",
  },
  {
    title: "Order Management",
    description:
      "Enabling tailor shops to manage, track, and fulfill customer orders efficiently.",
    expandedDetails:
      "Our order management system allows tailor shops to streamline their workflow, from receiving orders to tracking progress and delivering finished products. Features include real-time updates, automated notifications, and detailed analytics.",
    className: "col-span-1 row-span-1 bg-[#D8D8FF]",
    icon: Package,
  },
  {
    title: "Design & Customization",
    description:
      "Customers can design garments, get feedback, and connect with the right tailor shop.",
    expandedDetails:
      "Customers can unleash their creativity by designing garments directly on our platform. They can upload sketches, choose fabrics, and get feedback from tailors. We match them with the best tailor shops to bring their visions to life.",
    className: "col-span-2 row-span-1 bg-[#E8E8FF]",
    icon: Shirt,
  },
  {
    title: "Tailor Shop Network",
    description:
      "Multiple tailor shops can register, receive orders, and grow their business online.",
    expandedDetails:
      "Tailor shops can join our network to expand their reach, receive orders from a broader customer base, and grow their business. We provide tools for marketing, order management, and customer communication to help them succeed.",
    className: "col-span-1 row-span-1 bg-[#F0F0FF]",
  },
  {
    title: "Customer Creativity",
    description:
      "Customers can upload clothing ideas and receive tailor recommendations.",
    expandedDetails:
      "Our platform allows customers to upload their clothing ideas, whether sketches or inspirations, and receive personalized recommendations for tailor shops that match their style and needs. It's a space to turn ideas into reality.",
    className: "col-span-1 row-span-1 bg-[#F8F8FF]",
  },
  {
    title: "A Unique Platform",
    description:
      "Pioneering a tailor shop-focused e-commerce experience in Sri Lanka.",
    expandedDetails:
      "We are the first platform in Sri Lanka dedicated to tailor shops, offering a unique e-commerce experience that prioritizes custom fashion. From design to delivery, we provide an end-to-end solution for tailors and customers alike.",
    className: "col-span-2 row-span-1 bg-[#D8D8FF]",
    icon: Globe,
  },
];

export const aboutMeConfigs = [
  {
    id: "planning",
    title: "Planning",
    description: "Strategic project planning and requirements analysis.",
    expandedDetails:
      "I excel in strategic project planning, ensuring every detail is accounted for before development begins. This includes gathering requirements, defining scope, and creating timelines to deliver projects on time and within budget.",
    icon: Layout,
  },
  {
    id: "design",
    title: "Design",
    description: "Creating intuitive and scalable system architectures.",
    expandedDetails:
      "My design process focuses on building intuitive and scalable architectures that grow with your business. I use modern design principles to ensure systems are both user-friendly and efficient, from wireframes to database schemas.",
    icon: Database,
  },
  {
    id: "development",
    title: "Development",
    description: "Building robust applications with modern tech stacks.",
    expandedDetails:
      "I specialize in developing robust web applications using modern tech stacks like React, Next.js, Node.js, and more. My code is clean, maintainable, and optimized for performance, ensuring a seamless user experience.",
    icon: Code,
  },
  {
    id: "deployment",
    title: "Deployment",
    description: "Seamless deployment with CI/CD and cloud integration.",
    expandedDetails:
      "I ensure seamless deployment through CI/CD pipelines, containerization with Docker, and cloud integration with platforms like AWS and Vercel. My deployment process minimizes downtime and maximizes reliability.",
    icon: Rocket,
  },
];

export const designFeatures = [
  {
    id: "customize",
    title: "Customize",
    description: "Personalize garments with ease.",
    expandedDetails:
      "Our customization tools allow you to personalize every aspect of your garment, from fabric selection to stitching details. Use our intuitive interface to create a design that perfectly matches your style and preferences.",
    icon: Palette,
  },
  {
    id: "preview",
    title: "Preview",
    description: "See your design in real-time.",
    expandedDetails:
      "Experience real-time previews of your designs as you make changes. Our advanced rendering engine ensures you can visualize your garment in 3D, helping you make informed decisions before finalizing your order.",
    icon: Scissors,
  },
  {
    id: "collaborate",
    title: "Collaborate",
    description: "Work with tailors seamlessly.",
    expandedDetails:
      "Collaborate directly with tailors through our platform. Share your designs, get feedback, and make adjustments in real-time to ensure your vision is brought to life exactly as you imagined.",
    icon: Share2,
  },
  {
    id: "save",
    title: "Save",
    description: "Store your designs securely.",
    expandedDetails:
      "Save your designs securely on our platform for future reference. Whether you're working on multiple projects or revisiting past creations, your designs are always accessible and protected.",
    icon: Shirt,
  },
];

export const additionalServices = [
  {
    title: "Availability",
    description: "Check tailor and fabric availability in real-time.",
    expandedDetails:
      "Our platform provides real-time updates on tailor availability and fabric stock, ensuring you can plan your orders efficiently. Never worry about delays due to unavailability—stay informed at every step.",
    className: "col-span-1 row-span-1 bg-[#F0F0FF]",
    icon: Users,
  },
  {
    title: "Manage Orders",
    description: "Streamline order tracking and fulfillment.",
    expandedDetails:
      "Tailors can manage orders effortlessly with our intuitive order management system. Track progress, communicate with customers, and ensure timely fulfillment, all from a single dashboard.",
    className: "col-span-1 row-span-1 bg-[#E8E8FF]",
    icon: Package,
  },
  {
    title: "Inventories",
    description: "Keep track of fabrics and materials.",
    expandedDetails:
      "Our inventory management tools help tailor shops monitor their stock of fabrics and materials. Get alerts for low stock, manage reordering, and ensure you never run out of essential supplies.",
    className: "col-span-1 row-span-1 bg-[#D8D8FF]",
    icon: Truck,
  },
  {
    title: "Designs",
    description: "Organize and showcase your design portfolio.",
    expandedDetails:
      "Tailors and customers can organize their design portfolios on our platform. Showcase your best work, get feedback from the community, and attract more customers with a stunning portfolio.",
    className: "col-span-2 row-span-1 bg-[#E8E8FF]",
    icon: Palette,
  },
];
