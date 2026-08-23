import Card from './ui/Card';
import Button from './ui/Button';

export default function HistoryLog({ history, onClear }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.25rem' }}>History</h3>
        {history.length > 0 && (
          <Button onClick={onClear} style={{ padding: '7px 14px', fontSize: '13px' }}>
            Clear
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
          No actions yet
        </p>
      ) : (
        <div style={{ 
          maxHeight: '320px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {history.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-soft)',
                fontSize: '14px'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                {item.action}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {item.details} • {item.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}