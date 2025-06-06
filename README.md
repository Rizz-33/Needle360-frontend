# needle360 - Digital Marketplace and Community Hub for the tailoring sector in Sri Lanka

<div align="center">
    <br><br>
    <img src="https://github.com/Rizz-33/needle360-frontend/blob/main/public/logo-white-full.png" alt="needle360 Logo">
    <br><br>
</div>

## Overview

**needle360** is a web-based e-commerce platform designed specifically for tailor shops. The platform enables tailor shop owners to showcase and sell custom garments while allowing customers to design their own clothing, submit customizations, and interact with tailor shops seamlessly.

This project aims to revolutionize the tailor industry by providing a one-stop digital solution for custom apparel shopping and order management.

## Features

### For Customers

- **Browse Tailor Shops**: Discover and explore tailor shops with unique styles.
- **Design Your Own Garment**: Use an interactive tool to customize clothing designs.
- **Upload Inspiration**: Submit pictures or sketches for tailor customization.
- **Engage with Tailors**: Communicate directly with tailors and receive design feedback.
- **Rating & Reviews**: Review tailor shops and provide feedback on designs.
- **Order Tracking**: Track the status of your orders in real time.
- **Wishlist & Favorites**: Save your favorite tailor shops and designs for future orders.

### For Tailors

- **Create a Digital Storefront**: Showcase custom designs and ready-to-wear apparel.
- **Manage Orders**: Receive and process custom orders with ease.
- **Customer Interaction**: Respond to design requests and provide updates.
- **Analytics Dashboard**: Monitor sales, order trends, and customer engagement.
- **Flexible Pricing System**: Set pricing based on fabric, design complexity, and customer requests.
- **Appointment Scheduling**: Manage customer appointments and availability calendar.
- **Inventory Management**: Track fabric stock and materials.

### For Administrators

- **User Management**: Oversee all platform users and their access rights.
- **Service Management**: Maintain and update available services.
- **Reporting**: Generate comprehensive reports on platform performance.
- **Content Moderation**: Ensure quality standards across the platform.

## System Architecture

needle360 follows a layered architecture to ensure scalability and maintainability:

### Frontend Layer

- **Admin Portal**: Comprehensive management dashboard for platform administrators
- **Tailor Portal**: Feature-rich interface for tailor shop management
- **Customer Portal**: User-friendly interface for browsing, customizing, and ordering

### Integration Layer

- **API Gateway**: Manages API requests between frontend and backend
- **Event Bus**: Facilitates real-time communication between services
- **External Integrations**: Connects with payment processors, email services, and storage solutions

### Backend Layer

Multiple microservices handle specific business domains:

- Authentication Service (All users)
- Order Service
- Design Service
- Inventory Service
- Payment Service
- Messaging Service
- Appointment Service
- Review Service
- and more

### Data Layer

- **MongoDB**: Primary database storing user profiles, orders, designs, and more
- **Redis**: Caching for improved performance
- **Cloudinary**: Cloud storage for design images and documents

## Technology Stack

- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: JWT with role-based access control
- **Deployment**: Vercel/Netlify (Frontend), AWS/DigitalOcean (Backend)
- **Payment Gateway**: Stripe integration
- **Messaging**: SocketIO
- **Email Service**: Mailtrap
- **File Storage**: Cloudinary

## Getting Started

### Prerequisites

Ensure you have the following installed before setting up the project:

- **Node.js** (v18+ recommended)
- **Git**
- **PNPM/Yarn/NPM**
- **MongoDB** (local or Atlas connection)
- **Redis** (optional for development)

### Installation

Clone the repository and navigate into the project directory:

```bash
# Clone the repository
git clone https://github.com/Rizz-33/needle360-frontend.git
cd needle360-frontend

# Install dependencies
npm install  # or pnpm install / yarn install
```

### Running the Development Server

```bash
npm run dev  # or npm run dev / yarn dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Configuration
API_URL="http://13.61.16.74:4000/"
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Contributing

We welcome contributions from the community! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature description"`
4. Push to the branch: `git push origin feature-name`
5. Submit a Pull Request.

## Roadmap

- ✅ Basic UI & Authentication
- ✅ Tailor Shop Onboarding
- ✅ Order & Payment Integration
- ⏳ Enhanced Analytics Dashboard (Upcoming)

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any queries, feel free to reach out:

- **GitHub**: [@Rizz-33](https://github.com/Rizz-33)
- **Email**: aarruwanthie@gmail.com

---

Craft your style with **needle360** – Where Tailoring Meets Technology! ✂️🧵
