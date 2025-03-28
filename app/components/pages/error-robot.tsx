import { useEffect, useState } from "react";

const ErrorRobot = () => {
  const [blink, setBlink] = useState(false);
  const [tilt, setTilt] = useState(false);

  useEffect(() => {
    // Blinking animation
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);

    // Occasional head tilt
    const tiltInterval = setInterval(() => {
      setTilt(true);
      setTimeout(() => setTilt(false), 300);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(tiltInterval);
    };
  }, []);

  return (
    <div className="relative w-40 h-44 mb-4">
      {/* Robot Body */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-28 bg-slate-700 rounded-xl shadow-md border-t-4 border-purple-500">
        {/* Robot Control Panel */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-slate-800 rounded-md flex justify-center items-center">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mx-1"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500 mx-1"></div>
          <div className="h-2 w-2 rounded-full bg-green-500 mx-1 opacity-50"></div>
        </div>
      </div>

      {/* Robot Head */}
      <div
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-24 bg-slate-600 rounded-2xl shadow-lg transition-transform duration-300 ${
          tilt ? "rotate-3" : ""
        }`}>
        {/* Robot Face */}
        <div className="absolute top-6 left-0 w-full flex justify-center space-x-8">
          {/* Eyes */}
          <div
            className={`w-5 h-5 rounded-full ${
              blink ? "bg-slate-600 h-1" : "bg-purple-400"
            } transition-all duration-100 flex items-center justify-center`}>
            <div className="w-2 h-2 rounded-full bg-purple-200"></div>
          </div>
          <div
            className={`w-5 h-5 rounded-full ${
              blink ? "bg-slate-600 h-1" : "bg-purple-400"
            } transition-all duration-100 flex items-center justify-center`}>
            <div className="w-2 h-2 rounded-full bg-purple-200"></div>
          </div>
        </div>

        {/* Mouth - Zigzag pattern to indicate error */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-14">
          <svg
            width="100%"
            height="6"
            viewBox="0 0 100 10"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,5 L10,0 L20,10 L30,0 L40,10 L50,0 L60,10 L70,0 L80,10 L90,0 L100,5"
              fill="none"
              stroke="#EC4899"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Antenna */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-slate-500 flex justify-center">
          <div className="absolute -top-2 w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
        </div>
      </div>

      {/* Some electric sparks around the robot */}
      <div className="absolute top-4 -right-2 w-4 h-4 opacity-0 animate-ping text-yellow-300">
        ⚡
      </div>
      <div className="absolute bottom-10 -left-2 w-4 h-4 opacity-0 animate-ping text-yellow-300 animation-delay-700">
        ⚡
      </div>
    </div>
  );
};

export default ErrorRobot;
