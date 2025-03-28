import { useEffect, useState } from "react";

const LostAstronaut = () => {
  const [float, setFloat] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [wave, setWave] = useState(false);

  useEffect(() => {
    // Floating animation
    const floatInterval = setInterval(() => {
      setFloat((prev) => !prev);
    }, 2000);

    // Occasional rotation
    const rotateInterval = setInterval(() => {
      setRotate(true);
      setTimeout(() => setRotate(false), 500);
    }, 4000);

    // Waving animation
    const waveInterval = setInterval(() => {
      setWave(true);
      setTimeout(() => setWave(false), 800);
    }, 3000);

    return () => {
      clearInterval(floatInterval);
      clearInterval(rotateInterval);
      clearInterval(waveInterval);
    };
  }, []);

  return (
    <div className="relative w-48 h-52 mb-4 ">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden ">
        <div className="absolute top-2 left-3 h-1 w-1 bg-white rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-12 left-40 h-1 w-1 bg-white rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-20 left-10 h-1 w-1 bg-white rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-28 left-32 h-1 w-1 bg-white rounded-full animate-pulse opacity-90"></div>
      </div>

      {/* Astronaut body */}
      <div
        className={`absolute top-10 left-1/2 transform -translate-x-1/2 transition-transform duration-1000 ${
          float ? "translate-y-2" : "-translate-y-2"
        } ${rotate ? "rotate-3" : ""}`}>
        {/* Spacesuit */}
        <div className="w-24 h-32 bg-slate-300 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-400 opacity-80"></div>

          {/* Backpack */}
          <div className="absolute -right-2 top-6 w-6 h-16 bg-slate-500 rounded-md"></div>

          {/* Helmet */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-18 h-16 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-400">
            {/* Visor */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-slate-800 rounded-lg overflow-hidden">
              <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-pulse animation-delay-700"></div>
            </div>
          </div>

          {/* Arms */}
          <div
            className={`absolute -left-5 top-8 w-5 h-16 bg-slate-400 rounded-full transform origin-right ${
              wave ? "rotate-45" : "rotate-15"
            } transition-transform duration-300`}></div>
          <div className="absolute -right-5 top-8 w-5 h-16 bg-slate-400 rounded-full"></div>

          {/* Legs */}
          <div className="absolute -bottom-8 left-4 w-6 h-12 bg-slate-400 rounded-lg"></div>
          <div className="absolute -bottom-8 right-4 w-6 h-12 bg-slate-400 rounded-lg"></div>

          {/* Oxygen tube */}
          <div className="absolute left-0 top-2 w-1 h-6 bg-slate-100 rounded-full transform rotate-45 origin-bottom-left"></div>
        </div>
      </div>

      {/* Floating text bubble */}
      <div className="absolute -top-2 right-2 bg-white rounded-lg p-2 text-xs text-slate-700 opacity-80">
        <p>Lost in space!</p>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-white"></div>
      </div>

      {/* Moon surface hint at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-700 rounded-full opacity-30"></div>
    </div>
  );
};

export default LostAstronaut;
