export function NoiseTexture() {
  return (
    <svg className="fixed inset-0 h-full w-full opacity-20 brightness-100 contrast-150 pointer-events-none"
      style={{ filter: "contrast(150%) brightness(100%)" }}>
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
    </svg>
  );
}