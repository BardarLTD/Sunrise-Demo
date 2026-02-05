'use client';

export function WhiteboardBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#1a1a1a]" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, #3a3a3a 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
