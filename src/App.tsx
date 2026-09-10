import { useState, useEffect, useRef, useCallback } from 'react';

const SVG_PATH = "M125.158,26.163c0.124,-13.618 -1.999,-24.993 12.793,-25.748c38.964,-1.989 41.874,7.93 47.848,14.846c3.397,3.933 4.518,0.999 5.664,-3.541c3.238,-12.823 7.248,-11.412 37.802,-11.404c11.461,0.003 11.307,1.037 18.067,3.522c6.23,2.29 5.831,-3.278 18.829,-3.519c28.337,-0.525 28.046,2.121 30.57,3.47c6.716,3.589 6.589,-3.12 19.458,-3.461c23.163,-0.615 35.89,1.642 45.981,13.581c8.716,10.313 9.604,26.128 8.56,33.539c-5.241,37.204 -36.295,35.435 -55.164,35.157c-12.062,-0.177 -12.5,-6.777 -18.83,-3.413c-7.666,4.074 -8.517,3.448 -28.072,3.418c-11.029,-0.017 -10.813,-1.353 -16.827,-3.466c-6.003,-2.109 -5.64,3.465 -20.072,3.466c-31.316,0.002 -31.975,0.639 -39.617,-4.856c-4.759,-3.422 -5.128,2.411 -10.502,3.768c-18.871,4.764 -19.697,-22.277 -29.265,-24.263c-8.712,-1.808 -4.144,13.798 -8.479,20.605c-4.447,6.982 -26.078,5.767 -31.437,1.886c-7.515,-5.441 -2.933,-18.023 -27.081,-14.374c-8.886,1.343 -8.571,18.529 -21.877,16.626c-15.9,-2.274 -1.284,-23.938 -0.993,-33.93c0.342,-11.732 -4.8,6.039 -25.232,8.856c-11.077,1.527 -15.766,-0.199 -16.031,13.65c-0.244,12.718 -16.031,15.83 -20.035,4.298c-1.806,-5.203 -0.945,-60.374 -0.595,-63.687c1.148,-10.872 8.14,-11.409 30.395,-10.793c40.722,1.127 29.268,39.94 35.494,33.747c7.693,-7.653 7.128,-31.113 21.459,-33.331c21.563,-3.337 20.023,13.834 29.312,35.377c8.313,19.281 7.835,-8.417 7.875,-10.023Zm196.957,6.254c0,19.985 -1.352,30.77 7.201,30.936c26.625,0.516 22.133,-29.528 16.646,-36.999c-5.994,-8.161 -21.439,-9.528 -23.094,-1.5c-0.774,3.755 -0.672,3.732 -0.753,7.563Zm-36.843,17.511c-0.036,4.822 -1.779,13.144 10.225,16.48c6.517,1.811 5.67,-7.615 5.666,-36.493c-0.001,-6.263 -0.041,-15.272 -6.249,-13.184c-11.265,3.789 -9.642,7.083 -9.642,33.197Zm-50.377,14.719c11.167,-0.173 11.441,5.311 16.835,3.282c10.241,-3.853 11.454,-8.135 11.781,-9.29c0.612,-2.163 1.066,-3.764 0.621,-28.097c-0.187,-10.211 -2.308,-10.471 -11.625,-15.239c-5.642,-2.887 -5.762,3.089 -18.867,3.132c-7.956,0.026 -22.325,-1.544 -19.726,8.915c2.436,9.806 30.193,-1.155 30.717,13.208c0.574,15.735 -26.773,4.575 -30.559,13.672c-3.51,8.434 5.533,9.743 6.468,9.878c7.125,1.031 7.127,0.316 14.356,0.539Zm-213.607,-35.98c0.538,6.451 0.937,10.616 9.708,10.384c11.578,-0.306 14.769,-19.698 -1.854,-20.118c-2.599,-0.066 -6.292,1.746 -7.127,5.292c-0.536,2.274 -0.527,2.243 -0.727,4.442Zm157.033,25.019c0.612,7.482 9.181,18.259 10.796,17.287c3.566,-2.147 4.048,-36.044 -1.564,-32.035c-1.141,0.815 -4.519,4.975 -6.082,7.029c-3.289,4.324 -2.933,4.762 -3.149,7.719Zm-89.502,-12.5c0.741,7.624 9.337,4.401 6.466,-2.45c-0.825,-1.969 -2.374,-2.714 -2.988,-2.692c-2.173,0.078 -3.354,4.661 -3.478,5.142Zm57.556,-13.771c0.146,2.526 -0.365,10.75 10.94,9.11c12.299,-1.784 9.782,-19.149 -4.31,-17.562c-5.84,0.658 -6.543,7.597 -6.629,8.452Z";

// Build the feFuncA tableValues string, matching the original tool's logic.
function buildTableValues(positionPercent: number): string {
  const STOPS = 400;
  const k = Math.round(((100 - positionPercent) / 100) * (STOPS - 1));
  const values: number[] = [];
  for (let i = 0; i < STOPS; i++) {
    if (i < k) values.push(0);
    else if (i === k) values.push(0.05);
    else values.push(1);
  }
  return values.join(' ');
}

function App() {
  // Morph state values (editable)
  // Deterioration is stored as % of 2em max (so 5 = 0.100em, 100 = 2em)
  const [state1Det, setState1Det] = useState(5);
  const [state1Op, setState1Op] = useState(15);
  const [state2Det, setState2Det] = useState(100);
  const [state2Op, setState2Op] = useState(85);
  const [duration, setDuration] = useState(4); // seconds

  // Current animated values
  const [deterioration, setDeterioration] = useState(state1Det);
  const [overprint, setOverprint] = useState(state1Op);

  const [isAnimating, setIsAnimating] = useState(true);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const directionRef = useRef<'forward' | 'backward'>('forward');

  // Use refs for morph targets so animation callback always reads latest values
  const state1DetRef = useRef(state1Det);
  const state1OpRef = useRef(state1Op);
  const state2DetRef = useRef(state2Det);
  const state2OpRef = useRef(state2Op);
  const durationRef = useRef(duration);

  useEffect(() => { state1DetRef.current = state1Det; }, [state1Det]);
  useEffect(() => { state1OpRef.current = state1Op; }, [state1Op]);
  useEffect(() => { state2DetRef.current = state2Det; }, [state2Det]);
  useEffect(() => { state2OpRef.current = state2Op; }, [state2Op]);
  useEffect(() => { durationRef.current = duration; }, [duration]);

  // Animation loop - morphs between State 1 and State 2
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const durationMs = durationRef.current * 1000;
    const progress = Math.min(elapsed / durationMs, 1);

    // Ease in-out cubic
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const s1d = state1DetRef.current;
    const s1o = state1OpRef.current;
    const s2d = state2DetRef.current;
    const s2o = state2OpRef.current;

    if (directionRef.current === 'forward') {
      setDeterioration(s1d + (s2d - s1d) * eased);
      setOverprint(s1o + (s2o - s1o) * eased);
    } else {
      setDeterioration(s2d + (s1d - s2d) * eased);
      setOverprint(s2o + (s1o - s2o) * eased);
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

  // Deterioration maps 0-100 → 0em to 2em blur
  const blurEm = (deterioration / 100) * 2;
  const blurPx = blurEm * 16;

  // Overprint maps 1-100 → curve position for feFuncA
  const tableValues = buildTableValues(overprint);

  // Helper to convert det % to em display
  const detToEm = (pct: number) => ((pct / 100) * 2).toFixed(3);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-tight">
          SVG Overprint Animator
        </h1>
        <p className="text-neutral-500 text-xs md:text-sm">
          Based on Mark Hurrell's overprint CSS generator technique
        </p>
      </div>

      {/* SVG Preview Area */}
      <div className="w-full max-w-4xl mb-8">
        <div
          className={`relative bg-neutral-900 rounded-2xl p-8 md:p-16 shadow-2xl border border-neutral-800 overflow-hidden ${isAnimating ? 'animate-glow' : ''}`}
        >
          {/* Subtle dot grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* SVG Container */}
          <div className="relative flex items-center justify-center">
            <svg
              width="100%"
              viewBox="-60 -40 492 164"
              xmlns="http://www.w3.org/2000/svg"
              style={{ maxWidth: '720px', overflow: 'visible' }}
            >
              <defs>
                <filter id="toneCurve" colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
                  <feComponentTransfer>
                    <feFuncA
                      id="curveA"
                      type="table"
                      tableValues={tableValues}
                    />
                  </feComponentTransfer>
                </filter>
              </defs>

              <path
                d={SVG_PATH}
                fill="#fefefe"
                style={{
                  filter: `blur(${blurPx}px) url(#toneCurve)`
                }}
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
              <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
              Deterioration
            </label>
            <span className="text-neutral-400 text-sm font-mono tabular-nums">
              {blurEm.toFixed(3)}em
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={deterioration}
            onChange={(e) => setDeterioration(Number(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer accent-orange-500"
          />
          <p className="text-neutral-600 text-xs mt-2">
            CSS <code className="text-neutral-400">filter: blur()</code> — softens edges
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
            min="1"
            max="100"
            step="1"
            value={overprint}
            onChange={(e) => setOverprint(Number(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer accent-cyan-500"
          />
          <p className="text-neutral-600 text-xs mt-2">
            SVG <code className="text-neutral-400">feComponentTransfer → feFuncA</code> — alpha threshold
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
              setDeterioration(state1Det);
              setOverprint(state1Op);
              setIsAnimating(false);
              directionRef.current = 'forward';
            }}
            className="px-6 py-3 rounded-lg font-medium text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all duration-200 border border-neutral-700"
          >
            ↺ Reset
          </button>
        </div>

        {/* Morph States Configuration */}
        <div className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800/50 mt-4">
          <h3 className="text-neutral-400 text-xs font-medium uppercase tracking-wider mb-4">Morph Animation Config</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State 1 */}
            <div className="bg-neutral-800/50 rounded-lg p-4 space-y-3">
              <span className="text-emerald-400 font-medium text-sm block">State 1</span>
              
              <div>
                <label className="text-neutral-500 text-xs block mb-1">Deterioration (em)</label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.01"
                  value={detToEm(state1Det)}
                  onChange={(e) => {
                    const em = parseFloat(e.target.value) || 0;
                    setState1Det(Math.round((em / 2) * 100));
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              <div>
                <label className="text-neutral-500 text-xs block mb-1">Overprint (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={state1Op}
                  onChange={(e) => setState1Op(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* State 2 */}
            <div className="bg-neutral-800/50 rounded-lg p-4 space-y-3">
              <span className="text-purple-400 font-medium text-sm block">State 2</span>
              
              <div>
                <label className="text-neutral-500 text-xs block mb-1">Deterioration (em)</label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.01"
                  value={detToEm(state2Det)}
                  onChange={(e) => {
                    const em = parseFloat(e.target.value) || 0;
                    setState2Det(Math.round((em / 2) * 100));
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-purple-500/50"
                />
              </div>
              
              <div>
                <label className="text-neutral-500 text-xs block mb-1">Overprint (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={state2Op}
                  onChange={(e) => setState2Op(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="mt-4 pt-4 border-t border-neutral-800/50">
            <label className="text-neutral-500 text-xs block mb-1">Transition Duration (seconds)</label>
            <input
              type="number"
              min="0.1"
              max="60"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(Math.max(0.1, Math.min(60, parseFloat(e.target.value) || 4)))}
              className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-neutral-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
