# Global Temperature Anomalies Viewer

![Rendu final](assets/img-rendu-final.png)

Interactive web application for visualizing global temperature anomalies from 1880 to 2025.

## Features

- Interactive world map with temperature overlays
- Manual year navigation with slider and direct input
- Animated timeline with playback controls
- Area and latitude selection modes
- Multiple group creation for data comparison
- Line/bar charts, histograms, and heatmaps
- Cross-view synchronization and highlighting

## Data Source

Temperature anomaly data is sourced from NASA GISS (Goddard Institute for Space Studies).
- Time range: 1880-2025
- Spatial resolution: 4° latitude × 4° longitude
- Anomaly base: 1951-1980 average
- Source: https://data.giss.nasa.gov/gistemp/

## Installation

```bash
git clone https://github.com/promaaa/global-temp-anomaly-viewer.git
cd global-temp-anomaly-viewer
npm install
npm run dev
```

The application will be available at http://localhost:5173

## Technologies

- React 19.2 with TypeScript
- Redux Toolkit for state management
- Recharts for data visualization
- Vite for build tooling