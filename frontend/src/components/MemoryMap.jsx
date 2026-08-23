import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

export default function MemoryMap({ status, onDeallocate }) {
  const [selectedProcess, setSelectedProcess] = useState(null);

  if (!status || !status.blocks) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🧠</div>
          <p>Initialize memory to see the live map</p>
        </div>
      </Card>
    );
  }

  const total = status.totalSize;

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Memory Map</h3>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {status.blocks.filter(b => b.allocated).length} processes
        </span>
      </div>

      {/* Visual Bar */}
      <div style={{
        display: 'flex',
        height: '64px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '16px',
        background: '#e8eef7'
      }}>
        {status.blocks.map((block, index) => {
          const width = (block.size / total) * 100;
          const isAllocated = block.allocated;
          const isSelected = selectedProcess === block.processId;

          return (
            <div
              key={index}
              onClick={() => {
                if (isAllocated) {
                  setSelectedProcess(isSelected ? null : block.processId);
                }
              }}
              title={isAllocated ? `${block.processId} (${block.size})` : `Free (${block.size})`}
              style={{
                width: `${width}%`,
                background: isAllocated
                  ? `linear-gradient(145deg, ${getColor(block.processId)}, ${getColor(block.processId)}cc)`
                  : 'linear-gradient(145deg, #dfe6e9, #b2bec3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isAllocated ? 'white' : '#2f3542',
                fontSize: width > 6 ? '13px' : '0',
                fontWeight: 600,
                cursor: isAllocated ? 'pointer' : 'default',
                transition: 'all 0.25s ease',
                transform: isSelected ? 'scaleY(1.15)' : 'scaleY(1)',
                zIndex: isSelected ? 5 : 1,
                textShadow: isAllocated ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
              }}
            >
              {isAllocated ? block.processId : 'Free'}
            </div>
          );
        })}
      </div>

      {/* Inline Free Option - appears only when a process is selected */}
      {selectedProcess && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff5f5',
          border: '1px solid #ffcdd2',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '20px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <span style={{ fontSize: '14px' }}>
            Free <strong>{selectedProcess}</strong>?
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => setSelectedProcess(null)}
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onDeallocate(selectedProcess);
                setSelectedProcess(null);
              }}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                background: 'linear-gradient(135deg, #ff5252, #ff1744)',
                color: 'white',
                border: 'none'
              }}
            >
              Free Memory
            </Button>
          </div>
        </div>
      )}

      {/* Detailed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {status.blocks.map((block, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#f8faff',
              border: '1px solid #e8eef7'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: block.allocated ? getColor(block.processId) : '#b2bec3'
              }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>
                  {block.allocated ? block.processId : 'Free Block'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {block.startAddress} → {block.startAddress + block.size - 1} • Size {block.size} KB
                </div>
              </div>
            </div>

            {block.allocated && (
              <Button
                onClick={() => onDeallocate(block.processId)}
                style={{ padding: '6px 14px', fontSize: '13px' }}
                className="danger"
              >
                Free
              </Button>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Card>
  );
}

function getColor(processId) {
  const colors = ['#ff6b6b', '#1e90ff', '#2ed573', '#ffa502', '#7c4dff', '#ff6348', '#00cec9', '#fd79a8'];
  let hash = 0;
  for (let i = 0; i < processId.length; i++) {
    hash = processId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}