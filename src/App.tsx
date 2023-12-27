import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ColorsPage() {
  const [colorA, setColorA] = useState("#ffffff");
  const [colorB, setColorB] = useState("#000000");
  const [steps, setSteps] = useState(10);
  const [colors, setColors] = useState<string[]>([]);
 
  const handleSubmit = (event: any) => {
    event.preventDefault();
    let color1 = colorA;
    let color2 = colorB;
    const regex = /^#/;
    const regex2 = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (!regex.test(colorA)) {
      color1 = `#${colorA}`;
    }
    if (!regex.test(colorB)) {
      color2 = `#${colorB}`;
    }

    if (!regex2.test(color1) || !regex2.test(color2)) {
      toast.error('Error: No se puede generar el color', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    setColorA(color1);
    setColorB(color2);

    const newColors = transitionColors(color1, color2, steps);
    setColors(newColors);
  };

  const notify = (color: any) => {
    const msg = `Color ${color} copiado!`;
    toast.success(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="p-6 border-b-2 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white my-4">
          Color Transition
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
          <span>
            <label htmlFor="color1" className="text-gray-800 dark:text-white">
              Color 1
            </label>
            <input
              maxLength={9}
              minLength={6}
              id="color1"
              name="color1"
              type="text"
              value={colorA}
              onChange={(e) => setColorA(e.target.value)}
              placeholder="#ffffff"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4 max-w-40"
            />
          </span>
          <span>
            <label htmlFor="color2" className="text-gray-800 dark:text-white">Color 2</label>
            <input
              maxLength={9}
              minLength={6}
              id="color2"
              name="color2"
              type="text"
              value={colorB}
              onChange={(e) => setColorB(e.target.value)}
              placeholder="#feffff"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4 max-w-40"
            />
          </span>
          <span>
            <label htmlFor="steps" className="text-gray-800 dark:text-white">
              Steps
            </label>
            <input
              id="steps"
              name="steps"
              type="number"
              max={100}
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4 max-w-40"
            />
          </span>
          <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            Generate Colors
          </button>
        </form>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {colors.map((color, index) => {
          let rgb = hexToRgb(color);
          let textColor = isLightColor(rgb) ? '#000000' : '#ffffff';
          return (
            <div
              key={index}
              style={{ backgroundColor: color, color: textColor }}
              className="w-full h-20 flex items-center justify-center text-white rounded-lg hover:shadow-[#a9a9a9] hover:shadow-lg cursor-pointer active:shadow-none transition-all"
              onClick={() => {
                navigator.clipboard.writeText(color.substring(1));
                console.log(color);
                notify(color);
              }} 
            >
              {color}
            </div>
          );
        })}
      </div>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      />
    </div>
  );
}

function transitionColors(colorA: any, colorB: any, steps: any) {
  let rgba = hexToRgb(colorA);
  let rgbz = hexToRgb(colorB);

  let colors = [];
  for (let i = 0; i <= steps; i++) {
      let ratio = i / steps;
      let r = Math.round(rgba.r + ratio * (rgbz.r - rgba.r));
      let g = Math.round(rgba.g + ratio * (rgbz.g - rgba.g));
      let b = Math.round(rgba.b + ratio * (rgbz.b - rgba.b));
      colors.push(rgbToHex({r: r, g: g, b: b}));
  }
  return colors;
}

function hexToRgb(hex: any) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return {r: r, g: g, b: b};
}

function rgbToHex(rgb: any) {
  let r = rgb.r.toString(16).padStart(2, '0');
  let g = rgb.g.toString(16).padStart(2, '0');
  let b = rgb.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function luminance(r: number, g: number, b: number) {
  let a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function isLightColor(rgb: { r: number, g: number, b: number }) {
  return luminance(rgb.r, rgb.g, rgb.b) > 0.5;
}
