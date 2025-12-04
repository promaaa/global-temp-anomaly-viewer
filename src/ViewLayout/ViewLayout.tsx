import './ViewLayout.css';
import { useState } from 'react';
import { GraphContainer } from '../Graph/GraphContainer';
import { Histogram } from '../Histogram/Histogram';
import { Heatmap } from '../Heatmap/Heatmap';
import { Analysis } from '../Analysis/Analysis';

type ViewType = 'graph' | 'histogram' | 'heatmap' | 'analysis';

interface ViewConfig {
  type: ViewType;
  visible: boolean;
  order: number;
}

export function ViewLayout() {
  const [views, setViews] = useState<ViewConfig[]>([
    { type: 'graph', visible: true, order: 0 },
    { type: 'histogram', visible: true, order: 1 },
    { type: 'heatmap', visible: true, order: 2 },
    { type: 'analysis', visible: true, order: 3 }
  ]);

  const [layout, setLayout] = useState<'column' | 'grid'>('column');

  const toggleView = (type: ViewType) => {
    setViews(views.map(v =>
      v.type === type ? { ...v, visible: !v.visible } : v
    ));
  };

  const moveUp = (type: ViewType) => {
    const index = views.findIndex(v => v.type === type);
    if (index > 0) {
      const newViews = [...views];
      [newViews[index - 1], newViews[index]] = [newViews[index], newViews[index - 1]];
      newViews.forEach((v, i) => v.order = i);
      setViews(newViews);
    }
  };

  const moveDown = (type: ViewType) => {
    const index = views.findIndex(v => v.type === type);
    if (index < views.length - 1) {
      const newViews = [...views];
      [newViews[index], newViews[index + 1]] = [newViews[index + 1], newViews[index]];
      newViews.forEach((v, i) => v.order = i);
      setViews(newViews);
    }
  };

  const getViewComponent = (type: ViewType) => {
    switch (type) {
      case 'graph':
        return <GraphContainer />;
      case 'histogram':
        return <Histogram />;
      case 'heatmap':
        return <Heatmap />;
      case 'analysis':
        return <Analysis />;
    }
  };

  const getViewTitle = (type: ViewType) => {
    switch (type) {
      case 'graph':
        return 'Temperature Graph';
      case 'histogram':
        return 'Histogram by Longitude';
      case 'heatmap':
        return 'Temperature Heatmap';
      case 'analysis':
        return 'Trend Analysis';
    }
  };

  return (
    <div className="view-layout-container">
      <div className="layout-controls">
        <h4>View Management</h4>
        <div className="layout-buttons">
          <button
            className={`layout-button ${layout === 'column' ? 'active' : ''}`}
            onClick={() => setLayout('column')}
            title="Stack views vertically"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <rect x="3" y="3" width="18" height="5" fill="currentColor" />
              <rect x="3" y="10" width="18" height="5" fill="currentColor" />
              <rect x="3" y="17" width="18" height="5" fill="currentColor" />
            </svg>
            Column
          </button>
          <button
            className={`layout-button ${layout === 'grid' ? 'active' : ''}`}
            onClick={() => setLayout('grid')}
            title="Arrange views in a grid"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <rect x="3" y="3" width="8" height="8" fill="currentColor" />
              <rect x="13" y="3" width="8" height="8" fill="currentColor" />
              <rect x="3" y="13" width="8" height="8" fill="currentColor" />
              <rect x="13" y="13" width="8" height="8" fill="currentColor" />
            </svg>
            Grid
          </button>
        </div>

        <div className="view-toggles">
          {views.map((view, index) => (
            <div key={view.type} className="view-toggle-item">
              <label className="view-toggle-label">
                <input
                  type="checkbox"
                  checked={view.visible}
                  onChange={() => toggleView(view.type)}
                />
                <span>{getViewTitle(view.type)}</span>
              </label>
              <div className="view-order-controls">
                <button
                  className="order-button"
                  onClick={() => moveUp(view.type)}
                  disabled={index === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="order-button"
                  onClick={() => moveDown(view.type)}
                  disabled={index === views.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`views-container layout-${layout}`}>
        {views
          .filter(v => v.visible)
          .sort((a, b) => a.order - b.order)
          .map(view => (
            <div key={view.type} className="view-wrapper">
              {getViewComponent(view.type)}
            </div>
          ))
        }
      </div>
    </div>
  );
}
