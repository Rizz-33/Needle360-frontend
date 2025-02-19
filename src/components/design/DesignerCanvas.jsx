import { Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { Card, CardContent } from "../ui/Card";

const DesignerCanvas = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState("#ff0000");

  useEffect(() => {
    // Dynamically import fabric.js and initialize the canvas
    import("fabric")
      .then((fabric) => {
        const newCanvas = new fabric.default.Canvas(canvasRef.current, {
          width: window.innerWidth * 0.7,
          height: 600,
          backgroundColor: "white",
        });
        setCanvas(newCanvas);
      })
      .catch(console.error);

    // Cleanup function to dispose of the canvas on component unmount
    return () => canvas?.dispose();
  }, []);

  const handleColorChange = (color) => {
    setColor(color.hex);
    // Change the background color of the canvas
    canvas?.setBackgroundColor(color.hex, canvas.renderAll.bind(canvas));
  };

  const addText = () => {
    if (!canvas) return;
    // Dynamically import fabric.js and add text to the canvas
    import("fabric").then((fabric) => {
      const text = new fabric.default.Text("Your Text", {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: "#000",
        fontFamily: "Arial",
        fontWeight: "bold",
      });
      canvas.add(text);
    });
  };

  const addImage = (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      // Dynamically import fabric.js and add image to the canvas
      import("fabric").then((fabric) => {
        fabric.default.Image.fromURL(f.target.result, (img) => {
          img.scaleToWidth(200);
          img.scaleToHeight(200);
          img.set({ left: 100, top: 100 });
          canvas.add(img);
        });
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-row items-start gap-1 p-6 w-full">
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-300 rounded-lg flex-grow"
      />
      <Card className="p-4 w-1/4 bg-transparent border-none shadow-none">
        <CardContent className="flex flex-col items-center gap-4">
          <SketchPicker
            color={color}
            onChange={handleColorChange}
            width={250}
          />
          <div className="flex gap-4 text-sm">
            <button onClick={addText}>Add Text</button>
            <label className="flex items-center gap-2 p-2 cursor-pointer">
              <Upload size={12} />
              <span>Upload Image</span>
              <input type="file" onChange={addImage} className="hidden" />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignerCanvas;
