import React from "react";
import Button from "../components/Button";

const Home = () => {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <div>
      <Button onClick={handleClick} className="custom-class">
        Click Me
      </Button>
    </div>
  );
};

export default Home;
