export default function Header() {
  return (
    <header style={{
      background: 'var(--bg-hero)',
      borderRadius: '0 0 32px 32px',
      padding: '48px 24px 56px',
      marginBottom: '40px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(26, 43, 107, 0.25)'
    }}>
      {/* Subtle pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 50%),
                          radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />

      <h1 style={{
  fontSize: 'clamp(2rem, 5vw, 2.8rem)',
  fontWeight: 800,
  color: 'rgb(255, 255, 255)',
  marginBottom: '12px',
  letterSpacing: '2px', 
  position: 'relative',
  fontFamily: '"Nosifer", sans-serif',
  textShadow: '0 4px 10px rgba(0, 0, 0, 0.5)'
}}>
  Memory Allocator Simulator
</h1>

      <p style={{
        color: 'rgba(255,255,255,0.85)',
        fontSize: '1.1rem',
        fontWeight: 500,
        position: 'relative'
      }}>
        First Fit • Best Fit • Worst Fit • Next Fit
      </p>
    </header>
  );
}