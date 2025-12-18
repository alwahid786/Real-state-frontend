const Spinner = ({ size = 44, fullscreen = false, cn = "" }) => {
  return (
    <div
      className={`
        flex items-center justify-center h-screen w-screen
        ${fullscreen ? "fixed inset-0 bg-white/70 backdrop-blur-sm z-50" : ""}
        ${cn}
      `}
    >
      <div
        className="relative animate-spin"
        style={{ width: size, height: size }}
      >
        {/* Outer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, #7C5825, #E6CE65, #7C5825)",
          }}
        />

        {/* Inner */}
        <div className="absolute inset-1 rounded-full bg-white" />
      </div>
    </div>
  );
};

export default Spinner;
