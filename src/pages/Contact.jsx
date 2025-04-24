import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import React, { useState } from "react";
import { CustomButton } from "../components/ui/Button";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";
import { contactMethods } from "../configs/Services.configs";

const Contact = () => {
  const [activeMethod, setActiveMethod] = useState("email");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-white py-20 flex">
      <NavbarMenu />
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dot-black/[0.1] -z-10" />
      <div className="absolute inset-0 bg-white" />

      <div className="w-full mx-auto relative z-10">
        <div className="space-y-24 w-full my-16">
          {/* Contact Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl" />
              <div className="relative bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-300 max-w-screen-xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs">
                      <Mail className="w-3.5 h-3.5 mr-2" />
                      Get In Touch
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      Let's Discuss Your <br /> Next Project
                    </h3>

                    <p className="text-gray-700 text-xs leading-relaxed">
                      Have a web development project in mind? I'm here to help
                      turn your vision into reality. Reach out through any of
                      the methods below and let's start building something
                      amazing together.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {contactMethods.map((method) => (
                        <motion.div
                          key={method.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-300 text-sm ${
                            activeMethod === method.id
                              ? "bg-primary/20 border-primary/30"
                              : "bg-gray-100 border-gray-300"
                          } border`}
                          onClick={() => setActiveMethod(method.id)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <method.icon
                            className={`w-5 h-5 mb-2 ${
                              activeMethod === method.id
                                ? "text-primary"
                                : "text-gray-400"
                            }`}
                          />
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {method.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {method.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-grid-black/[0.02] rounded-3xl" />
                    <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-6 h-full">
                      <form onSubmit={handleSubmit} className="h-full">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Send a Message
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-xs font-medium text-gray-700 mb-1"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              placeholder="Your name"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-xs font-medium text-gray-700 mb-1"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="message"
                              className="block text-xs font-medium text-gray-700 mb-1"
                            >
                              Message
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              placeholder="Tell me about your project..."
                              required
                            />
                          </div>

                          <CustomButton
                            text="Send Message"
                            color="primary"
                            hover_color="gray-300"
                            variant="outlined"
                            width="w-full"
                            height="h-9"
                            type="button"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
