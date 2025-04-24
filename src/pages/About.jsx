import { motion } from "framer-motion";
import { Code, Database, Layout, Rocket } from "lucide-react";
import React, { useState } from "react";
import Footer from "../components/ui/Footer";
import NavbarMenu from "../components/ui/Navbar-menu";
import { sdlcFeatures } from "../configs/Services.configs";

const About = () => {
  const [activeFeature, setActiveFeature] = useState("planning");

  return (
    <div className="h-screen w-full overflow-y-auto bg-white py-20 flex">
      <NavbarMenu />
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dot-black/[0.1] -z-10" />
      <div className="absolute inset-0 bg-white" />

      <div className="w-full mx-auto relative z-10">
        <div className="space-y-24 w-full my-16">
          {/* About Me Section */}
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
                      <Code className="w-3.5 h-3.5 mr-2" />
                      About Me
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      Full-Stack Web <br /> Development Specialist
                    </h3>

                    <p className="text-gray-700 text-xs leading-relaxed">
                      I'm a dedicated web developer specializing in the complete
                      software development lifecycle. From initial concept and
                      planning through to deployment and maintenance, I create
                      innovative, scalable web applications with modern
                      technologies.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {sdlcFeatures.map((feature) => (
                        <motion.div
                          key={feature.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-300 text-sm ${
                            activeFeature === feature.id
                              ? "bg-primary/20 border-primary/30"
                              : "bg-gray-100 border-gray-300"
                          } border`}
                          onClick={() => setActiveFeature(feature.id)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <feature.icon
                            className={`w-5 h-5 mb-2 ${
                              activeFeature === feature.id
                                ? "text-primary"
                                : "text-gray-400"
                            }`}
                          />
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {feature.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-grid-black/[0.02] rounded-3xl" />
                    <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-6 h-full">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="space-y-4">
                          <div className="bg-gray-100 rounded-lg p-3 backdrop-blur-sm border border-gray-300">
                            <Layout className="w-6 h-6 text-primary opacity-80 mb-2" />
                            <h4 className="text-gray-900 font-medium mb-1 text-sm">
                              Modern Frontend
                            </h4>
                            <p className="text-xs text-gray-500">
                              React, Next.js, and responsive design for optimal
                              user experiences
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-3 backdrop-blur-sm border border-gray-300">
                            <Database className="w-6 h-6 text-primary opacity-60 mb-2" />
                            <h4 className="text-gray-900 font-medium mb-1 text-sm">
                              Robust Backend
                            </h4>
                            <p className="text-xs text-gray-500">
                              Scalable architecture with Node.js, SQL and NoSQL
                              databases
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4 mt-8">
                          <div className="bg-gradient-to-br from-secondary/10 to-pink-200/10 rounded-lg p-3 backdrop-blur-sm border border-gray-300">
                            <Rocket className="w-6 h-6 text-primary mb-2" />
                            <h4 className="text-gray-900 font-medium mb-1 text-sm">
                              DevOps Integration
                            </h4>
                            <p className="text-xs text-gray-500">
                              CI/CD pipelines, Docker, and cloud deployment
                              expertise
                            </p>
                          </div>
                        </div>
                      </div>
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

export default About;
