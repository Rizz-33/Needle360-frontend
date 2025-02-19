import { Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { Card, CardContent } from "../ui/Card";

const DesignerCanvas = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState("#ff0000");

  useEffect(() => {
    import("fabric")
      .then((fabric) => {
        const newCanvas = new fabric.default.Canvas(canvasRef.current, {
          width: window.innerWidth * 0.8, // Adjust width to be more flexible
          height: 600,
          backgroundColor: "white",
        });
        setCanvas(newCanvas);
      })
      .catch(console.error);

    return () => canvas?.dispose();
  }, []);

  const handleColorChange = (color) => {
    setColor(color.hex);
    canvas?.setBackgroundColor(color.hex, canvas.renderAll.bind(canvas));
  };

  const addText = () => {
    if (!canvas) return;
    import("fabric").then((fabric) => {
      const text = new fabric.default.Text("Your Text", {
        left: 50,
        top: 50,
        fontSize: 30,
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
    <div className="flex flex-col items-center gap-6 p-6 w-full">
      <h2 className="text-2xl font-bold text-gray-800">Clothing Designer</h2>
      <Card className="p-4 shadow-md w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4">
          <SketchPicker color={color} onChange={handleColorChange} />
          <div className="flex gap-4">
            <button onClick={addText}>Add Text</button>
            <label className="flex items-center gap-2 p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300">
              <Upload size={18} />
              <span>Upload Image</span>
              <input type="file" onChange={addImage} className="hidden" />
            </label>
          </div>
        </CardContent>
      </Card>
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-300 rounded-lg shadow-md w-full" // Make the canvas full width
      />
    </div>
  );
};

export default DesignerCanvas;
