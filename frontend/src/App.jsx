import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProcessForm from './components/ProcessForm';
import MemoryMap from './components/MemoryMap';
import StatsPanel from './components/StatsPanel';
import HistoryLog from './components/HistoryLog';
import Button from './components/ui/Button';
import { initMemory, allocateProcess, deallocateProcess, resetMemory, getStatus, defragmentMemory } from './services/api';

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [previousStatus, setPreviousStatus] = useState(null);
  const [isDemoActive, setIsDemoActive] = useState(false);

  // For smooth in-app delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(null); // stores processId

  const addHistory = (action, details) => {
    const time = new Date().toLocaleTimeString();
    setHistory(prev => [{ action, details, time }, ...prev].slice(0, 50));
  };

  const refreshStatus = async () => {
    try {
      const res = await getStatus();
      setStatus(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const handleInit = async (size) => {
    setLoading(true);
    setError('');
    try {
      const res = await initMemory(size);
      setStatus(res.data);
      setIsDemoActive(false);
      addHistory('Memory Initialized', `Total size: ${size}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initialize');
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await allocateProcess(data);
      setStatus(res.data);
      setIsDemoActive(false);
      addHistory('Allocated', `${data.processId} (${data.size}) using ${data.algorithm.replace('_', ' ')}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Allocation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeallocate = async (processId) => {
    setLoading(true);
    setError('');
    try {
      const res = await deallocateProcess(processId);
      setStatus(res.data);
      addHistory('Deallocated', processId);
      setConfirmDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Deallocation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await resetMemory();
      setStatus(res.data);
      setIsDemoActive(false);
      addHistory('Memory Reset', 'All processes cleared');
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };
  const handleDefragment = async () => {
  setLoading(true);
  setError('');
  try {
    const res = await defragmentMemory();
    setStatus(res.data);
    addHistory('Defragmented', 'Removed external fragmentation');
  } catch (err) {
    setError(err.response?.data?.error || 'Defragmentation failed');
  } finally {
    setLoading(false);
  }
};

  // Demo Scenario
  const runDemo = async () => {
    setLoading(true);
    setError('');
    try {
      setPreviousStatus(status);
      await initMemory(1024);
      await allocateProcess({ processId: 'Chrome', size: 220, algorithm: 'FIRST_FIT' });
      await allocateProcess({ processId: 'VSCode', size: 180, algorithm: 'BEST_FIT' });
      await allocateProcess({ processId: 'Spotify', size: 90, algorithm: 'WORST_FIT' });
      await allocateProcess({ processId: 'Discord', size: 130, algorithm: 'NEXT_FIT' });

      const res = await getStatus();
      setStatus(res.data);
      setIsDemoActive(true);
      addHistory('Demo Loaded', '4 sample processes allocated');
    } catch (err) {
      setError('Demo failed');
    } finally {
      setLoading(false);
    }
  };

  // Undo Demo
  const undoDemo = async () => {
    if (!previousStatus) {
      handleReset();
      return;
    }

    setLoading(true);
    try {
      await initMemory(previousStatus.totalSize);
      for (const block of previousStatus.blocks) {
        if (block.allocated) {
          await allocateProcess({
            processId: block.processId,
            size: block.size,
            algorithm: 'FIRST_FIT'
          });
        }
      }
      const res = await getStatus();
      setStatus(res.data);
      setIsDemoActive(false);
      addHistory('Demo Undone', 'Restored previous state');
    } catch (err) {
      setError('Could not fully restore previous state');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '0 16px 50px',
      background: 'var(--bg-body)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Header />

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <Button variant="primary" onClick={runDemo} disabled={loading}>
            Load Demo Scenario
          </Button>
          <Button onClick={handleDefragment} disabled={loading || !status}>
           Defragment Memory
          </Button>
          {isDemoActive && (
            <Button onClick={undoDemo} disabled={loading}>
              Undo Demo
            </Button>
          )}
        </div>

        {error && (
          <div style={{
            background: '#ffe0e0',
            color: '#c0392b',
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center',
            fontWeight: 500,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {error}
          </div>
        )}

        {/* Main Grid */}
        <div className="main-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <ProcessForm
              onInit={handleInit}
              onAllocate={handleAllocate}
              onReset={handleReset}
              status={status}
              disabled={loading}
            />
            <StatsPanel status={status} />
            <HistoryLog history={history} onClear={() => setHistory([])} />
          </div>

          <MemoryMap
  status={status}
  onDeallocate={handleDeallocate}
/>
        </div>

        {/* Attractive Explanation Section */}
        <div style={{
          marginTop: '50px',
          background: 'white',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(26, 43, 107, 0.06)'
        }}>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            marginBottom: '8px',
            color: 'var(--primary)',
            textAlign: 'center'
          }}>
            How this app works
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            marginBottom: '36px',
            fontSize: '1.05rem'
          }}>
            Visualize how an Operating System gives memory to programs
          </p>

          {/* 3-step flow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <StepCard icon="1" title="Initialize" text="Set total memory size (like total RAM)" color="#1e90ff" />
            <StepCard icon="2" title="Allocate" text="Give memory to a process using an algorithm" color="#00c853" />
            <StepCard icon="3" title="Watch Live" text="See blocks change in real-time + free them anytime" color="#7c4dff" />
          </div>

          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            marginBottom: '20px',
            textAlign: 'center',
            color: 'var(--text-primary)'
          }}>
            4 Ways the OS can allocate memory
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            <AlgoCard emoji="🚀" title="First Fit" text="Takes the first free block that is big enough" color="#ff6b6b" />
            <AlgoCard emoji="🎯" title="Best Fit" text="Chooses the smallest free block that fits (less waste)" color="#1e90ff" />
            <AlgoCard emoji="📦" title="Worst Fit" text="Always picks the largest free block" color="#ffa502" />
            <AlgoCard emoji="🔄" title="Next Fit" text="Starts searching from the last place it allocated" color="#2ed573" />
          </div>

          <p style={{
            textAlign: 'center',
            marginTop: '32px',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem'
          }}>
            Hover any colored block above to highlight it • Click to free memory instantly
          </p>
        </div>
      </div>

      {/* ===== Smooth In-App Delete Confirmation Modal ===== */}
      {confirmDelete && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 28, 77, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              Free this process?
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Are you sure you want to deallocate <strong>{confirmDelete}</strong>?
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleDeallocate(confirmDelete)}
                style={{ background: 'linear-gradient(135deg, #ff5252, #ff1744)' }}
              >
                Free Memory
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .main-grid {
          display: grid;
          grid-template-columns: minmax(300px, 380px) 1fr;
          gap: 26px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function StepCard({ icon, title, text, color }) {
  return (
    <div style={{
      background: '#f8faff',
      borderRadius: '16px',
      padding: '22px 18px',
      textAlign: 'center',
      border: '1px solid #e8eef7'
    }}>
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: color,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: '1.2rem',
        margin: '0 auto 14px'
      }}>
        {icon}
      </div>
      <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.05rem' }}>{title}</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

function AlgoCard({ emoji, title, text, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: `2px solid ${color}22`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
    }}>
      <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{emoji}</div>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px', color }}>{title}</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{text}</div>
    </div>
  );
}

export default App;