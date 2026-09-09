import { useState, useEffect, useRef, useCallback } from 'react';

const SVG_PATH = "M125.158,26.163c0.124,-13.618 -1.999,-24.993 12.793,-25.748c38.964,-1.989 41.874,7.93 47.848,14.846c3.397,3.933 4.518,0.999 5.664,-3.541c3.238,-12.823 7.248,-11.412 37.802,-11.404c11.461,0.003 11.307,1.037 18.067,3.522c6.23,2.29 5.831,-3.278 18.829,-3.519c28.337,-0.525 28.046,2.121 30.57,3.47c6.716,3.589 6.589,-3.12 19.458,-3.461c23.163,-0.615 35.89,1.642 45.981,13.581c8.716,10.313 9.604,26.128 8.56,33.539c-5.241,37.204 -36.295,35.435 -55.164,35.157c-12.062,-0.177 -12.5,-6.777 -18.83,-3.413c-7.666,4.074 -8.517,3.448 -28.072,3.418c-11.029,-0.017 -10.813,-1.353 -16.827,-3.466c-6.003,-2.109 -5.64,3.465 -20.072,3.466c-31.316,0.002 -31.975,0.639 -39.617,-4.856c-4.759,-3.422 -5.128,2.411 -10.502,3.768c-18.871,4.764 -19.697,-22.277 -29.265,-24.263c-8.712,-1.808 -4.144,13.798 -8.479,20.605c-4.447,6.982 -26.078,5.767 -31.437,1.886c-7.515,-5.441 -2.933,-18.023 -27.081,-14.374c-8.886,1.343 -8.571,18.529 -21.877,16.626c-15.9,-2.274 -1.284,-23.938 -0.993,-33.93c0.342,-11.732 -4.8,6.039 -25.232,8.856c-11.077,1.527 -15.766,-0.199 -16.031,13.65c-0.244,12.718 -16.031,15.83 -20.035,4.298c-1.806,-5.203 -0.945,-60.374 -0.595,-63.687c1.148,-10.872 8.14,-11.409 30.395,-10.793c40.722,1.127 29.268,39.94 35.494,33.747c7.693,-7.653 7.128,-31.113 21.459,-33.331c21.563,-3.337 20.023,13.834 29.312,35.377c8.313,19.281 7.835,-8.417 7.875,-10.023Zm196.957,6.254c0,19.985 -1.352,30.77 7.201,30.936c26.625,0.516 22.133,-29.528 16.646,-36.999c-5.994,-8.161 -21.439,-9.528 -23.094,-1.5c-0.774,3.755 -0.672,3.732 -0.753,7.563Zm-36.843,17.511c-0.036,4.822 -1.779,13.144 10.225,16.48c6.517,1.811 5.67,-7.615 5.666,-36.493c-0.001,-6.263 -0.041,-15.272 -6.249,-13.184c-11.265,3.789 -9.642,7.083 -9.642,33.197Zm-50.377,14.719c11.167,-0.173 11.441,5.311 16.835,3.282c10.241,-3.853 11.454,-8.135 11.781,-9.29c0.612,-2.163 1.066,-3.764 0.621,-28.097c-0.187,-10.211 -2.308,-10.471 -11.625,-15.239c-5.642,-2.887 -5.762,3.089 -18.867,3.132c-7.956,0.026 -22.325,-1.544 -19.726,8.915c2.436,9.806 30.193,-1.155 30.717,13.208c0.574,15.735 -26.773,4.575 -30.559,13.672c-3.51,8.434 5.533,9.743 6.468,9.878c7.125,1.031 7.127,0.316 14.356,0.539Zm-213.607,-35.98c0.538,6.451 0.937,10.616 9.708,10.384c11.578,-0.306 14.769,-19.698 -1.854,-20.118c-2.599,-0.066 -6.292,1.746 -7.127,5.292c-0.536,2.274 -0.527,2.243 -0.727,4.442Zm157.033,25.019c0.612,7.482 9.181,18.259 10.796,17.287c3.566,-2.147 4.048,-36.044 -1.564,-32.035c-1.141,0.815 -4.519,4.975 -6.082,7.029c-3.289,4.324 -2.933,4.762 -3.149,7.719Zm-89.502,-12.5c0.741,7.624 9.337,4.401 6.466,-2.45c-0.825,-1.969 -2.374,-2.714 -2.988,-2.692c-2.173,0.078 -3.354,4.661 -3.478,5.142Zm57.556,-13.771c0.146,2.526 -0.365,10.75 10.94,9.11c12.299,-1.784 9.782,-19.149 -4.31,-17.562c-5.84,0.658 -6.543,7.597 -6.629,8.452Z";

function App() {
  const [deterioration, setDeterioration] = useState(0);
  const [overprint, setOverprint] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const directionRef = useRef<'forward' | 'backward'>('forward');

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const duration = 5000;
    const progress = Math.min(elapsed / duration, 1);

    // Ease in-out cubic
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    if (directionRef.current === 'forward') {
      setDeterioration(eased * 100);
      setOverprint(eased * 100);
    } else {
      setDeterioration((1 - eased) * 100);
      setOverprint((1 - eased) * 100);
    }

    if (progress < 1) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      directionRef.current = directionRef.current === 'forward' ? 'backward' : 'forward';
      startTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    if (isAnimating) {
      startTimeRef.current = 0;
      animRef.current = requestAnimationFrame(animate);
    } else {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    }
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isAnimating, animate]);

  // Calculate filter parameters
  const detValue = deterioration / 100;
  const overprintValue = overprint / 100;

  // Deterioration parameters
  const noiseBaseFreq = 0.03 + detValue * 0.15;
  const displacementScale = detValue * 12;

  // Tone curve: threshold for eating away pixels
  // At 0% deterioration, threshold is 0 (nothing removed)
  // At 100% deterioration, threshold is high (lots removed)
  const threshold = Math.round(detValue * 180);
  const curveValues = Array.from({ length: 257 }, (_, i) => {
    if (i < threshold) return 0;
    if (i === threshold) return 0.1;
    return 1;
  }).join(' ');

  // Overprint parameters
  const offsetAmount = overprintValue * 5;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">
          SVG Overprint Animator
        </h1>
        <p className="text-neutral-500 text-xs md:text-sm">
          Deterioration & Overprint effects using SVG filters
        </p>
      </div>

      {/* SVG Preview Area */}
      <div className="w-full max-w-4xl mb-8">
        <div className={`relative bg-neutral-900 rounded-2xl p-8 md:p-16 shadow-2xl border border-neutral-800 overflow-hidden ${isAnimating ? 'animate-glow' : ''}`}>
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Container */}
          <div className="relative flex items-center justify-center">
            <svg
              width="100%"
              viewBox="0 0 372 84"
              xmlns="http://www.w3.org/2000/svg"
              style={{ maxWidth: '720px' }}
            >
              <defs>
                {/* Deterioration filter using feTurbulence + threshold + composite */}
                <filter id="deterioration" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency={noiseBaseFreq.toString()}
                    numOctaves={4}
                    seed={42}
                    result="noise"
                  />
                  <feComponentTransfer in="noise" result="thresholdNoise">
                    <feFuncA type="table" tableValues={curveValues} />
                  </feComponentTransfer>
                  <feComposite
                    in="SourceGraphic"
                    in2="thresholdNoise"
                    operator="out"
                    result="eroded"
                  />
                  <feDisplacementMap
                    in="eroded"
                    in2="noise"
                    scale={displacementScale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>

              {/* Overprint color layers */}
              {overprintValue > 0.01 && (
                <>
                  {/* Cyan channel - offset right and down */}
                  <g
                    style={{
                      transform: `translate(${offsetAmount}px, ${offsetAmount * 0.6}px)`,
                      opacity: 0.4 + overprintValue * 0.4,
                      mixBlendMode: 'screen'
                    }}
                  >
                    <path
                      d={SVG_PATH}
                      fill="#00e5ff"
                      filter={detValue > 0.01 ? "url(#deterioration)" : undefined}
                    />
                  </g>
                  {/* Magenta channel - offset left and up */}
                  <g
                    style={{
                      transform: `translate(${-offsetAmount * 0.8}px, ${-offsetAmount * 0.4}px)`,
                      opacity: 0.35 + overprintValue * 0.35,
                      mixBlendMode: 'screen'
                    }}
                  >
                    <path
                      d={SVG_PATH}
                      fill="#ff00e5"
                      filter={detValue > 0.01 ? "url(#deterioration)" : undefined}
                    />
                  </g>
                  {/* Yellow channel - offset slightly */}
                  <g
                    style={{
                      transform: `translate(${offsetAmount * 0.4}px, ${-offsetAmount * 0.9}px)`,
                      opacity: 0.3 + overprintValue * 0.3,
                      mixBlendMode: 'screen'
                    }}
                  >
                    <path
                      d={SVG_PATH}
                      fill="#ffe500"
                      filter={detValue > 0.01 ? "url(#deterioration)" : undefined}
                    />
                  </g>
                </>
              )}

              {/* Main white SVG path */}
              <path
                d={SVG_PATH}
                fill="#fefefe"
                filter={detValue > 0.01 ? "url(#deterioration)" : undefined}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Deterioration Slider */}
        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <label className="text-white font-medium text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              Deterioration
            </label>
            <span className="text-neutral-400 text-sm font-mono tabular-nums">
              {Math.round(deterioration)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={deterioration}
            onChange={(e) => setDeterioration(Number(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer accent-red-500"
          />
          <p className="text-neutral-600 text-xs mt-2">
            Noise erosion + displacement — simulates worn/damaged print
          </p>
        </div>

        {/* Overprint Slider */}
        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <label className="text-white font-medium text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>
              Overprint
            </label>
            <span className="text-neutral-400 text-sm font-mono tabular-nums">
              {Math.round(overprint)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={overprint}
            onChange={(e) => setOverprint(Number(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer accent-cyan-500"
          />
          <p className="text-neutral-600 text-xs mt-2">
            CMYK misregistration — simulates offset color separation
          </p>
        </div>

        {/* Animation Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              isAnimating
                ? 'bg-red-600/90 hover:bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
            }`}
          >
            {isAnimating ? '⏸ Pause' : '▶ Animate'}
          </button>
          <button
            onClick={() => {
              setDeterioration(0);
              setOverprint(0);
              setIsAnimating(false);
              directionRef.current = 'forward';
            }}
            className="px-6 py-3 rounded-lg font-medium text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all duration-200 border border-neutral-700"
          >
            ↺ Reset
          </button>
        </div>

        {/* Technical info */}
        <div className="text-center pt-4 pb-2">
          <p className="text-neutral-700 text-xs font-mono">
            feTurbulence → feComponentTransfer → feComposite(out) → feDisplacementMap
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
