import './Header.css';

export function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>Global Temperature Anomalies</h1>
          <p className="header-subtitle">Interactive Visualization of Climate Data (1880-2025)</p>
        </div>
      </div>
    </header>
  );
}
