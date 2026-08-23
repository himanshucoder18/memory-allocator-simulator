import { useState, useEffect } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

export default function ProcessForm({ onAllocate, onInit, onReset, status, disabled }) {
  const [totalSize, setTotalSize] = useState(1024);
  const [processId, setProcessId] = useState('');
  const [size, setSize] = useState(100);
  const [algorithm, setAlgorithm] = useState('FIRST_FIT');

  // Calculate maximum possible allocation (largest free block)
  const maxPossible = status?.blocks
    ? Math.max(...status.blocks.filter(b => !b.allocated).map(b => b.size), 0)
    : 0;

  useEffect(() => {
    if (size > maxPossible && maxPossible > 0) {
      setSize(maxPossible);
    }
  }, [maxPossible]);

  const handleInit = () => {
    if (totalSize > 0) onInit(Number(totalSize));
  };

  const handleAllocate = () => {
    if (!processId || size <= 0) return;
    onAllocate({
      processId: processId.trim(),
      size: Number(size),
      algorithm
    });
    setProcessId('');
    setSize(Math.min(100, maxPossible));
  };

  return (
    <Card>
      <h3 style={{ marginBottom: '22px', fontWeight: 700, fontSize: '1.25rem' }}>
        Controls
      </h3>

      {/* Initialize */}
      <div style={{ marginBottom: '28px' }}>
        <Input
          label="Total Memory Size"
          type="number"
          value={totalSize}
          onChange={(e) => setTotalSize(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button variant="primary" onClick={handleInit} disabled={disabled}>
            Initialize
          </Button>
          <Button onClick={onReset} disabled={disabled}>Reset</Button>
        </div>
      </div>

      <div style={{ height: '1px', background: '#d1d9e6', margin: '24px 0' }} />

      {/* Process ID */}
      <Input
        label="Process ID"
        value={processId}
        onChange={(e) => setProcessId(e.target.value)}
        placeholder="e.g. P1, Chrome, VSCode..."
        disabled={disabled || !status}
      />

      {/* Smart Slider */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontWeight: 500, color: 'var(--text-secondary)', fontSize: '14px' }}>
            Process Size
          </label>
          <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
          {size} KB / {maxPossible || '—'} KB
          </span>
        </div>

        <input
          type="range"
          className="neu-slider"
          min="1"
          max={maxPossible || 1}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          disabled={disabled || maxPossible === 0}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
          <span>1</span>
          <span>Max free block: {maxPossible} KB</span>
        </div>
      </div>

      <Select
        label="Algorithm"
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        disabled={disabled || !status}
      >
        <option value="FIRST_FIT">First Fit</option>
        <option value="BEST_FIT">Best Fit</option>
        <option value="WORST_FIT">Worst Fit</option>
        <option value="NEXT_FIT">Next Fit</option>
      </Select>

      <Button
        variant="primary"
        onClick={handleAllocate}
        disabled={disabled || !processId || size <= 0 || maxPossible === 0}
        style={{ width: '100%', marginTop: '10px' }}
      >
        Allocate Process
      </Button>
    </Card>
  );
}