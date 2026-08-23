import Card from './ui/Card';

export default function StatsPanel({ status }) {
  if (!status) return null;

  const usedPercent = status.totalSize > 0 
    ? Math.round((status.usedMemory / status.totalSize) * 100) 
    : 0;

  return (
    <Card>
      <h3 style={{ marginBottom: '22px', fontWeight: 700, fontSize: '1.25rem' }}>
        Statistics
      </h3>

      {/* Progress bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Memory Usage</span>
          <span style={{ fontWeight: 700 }}>{usedPercent}%</span>
        </div>
        <div style={{
          height: '12px',
          borderRadius: '10px',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-dark)',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${usedPercent}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-dark))',
            borderRadius: '10px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        <StatItem label="Total" value={`${status.totalSize} KB`} />
        <StatItem label="Used" value={`${status.usedMemory} KB`} color="var(--accent)" />
        <StatItem label="Free" value={`${status.freeMemory} KB`} color="var(--teal)" />
        <StatItem label="Ext. Frag" value={`${status.externalFragmentation} KB`} />
      </div>
    </Card>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div style={{
      padding: '14px',
      borderRadius: '14px',
      background: 'var(--surface)',
      boxShadow: 'var(--shadow-soft)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color || 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}