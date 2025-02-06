import React from "react";
import FloatingShape from "./components/FloatingShape";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-background via-primary to-background text-black flex items-center justify-center relative overflow-hidden">
        <FloatingShape
          color="bg-primary"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShape
          color="bg-accent"
          size="w-32 h-32"
          top="70%"
          left="80%"
          delay={0}
        />
        <FloatingShape
          color="bg-secondary"
          size="w-24 h-24"
          top="40%"
          left="-10%"
          delay={0}
        />
      </div>
    </>
  );
}

export default App;
