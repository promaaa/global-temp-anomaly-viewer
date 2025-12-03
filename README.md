# 🌍 Global Temperature Anomalies Viewer

An interactive web application for visualizing global temperature anomalies from 1880 to 2025. Built with React, Redux, and Recharts, this tool provides multiple visualization modes to explore climate data from NASA GISS.

![Temperature Anomalies Visualization](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat&logo=redux)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)

## 🎯 Features

### Navigation & Animation (Priority 1-3)
- ✅ **Manual Year Navigation** - Browse through years using slider or direct input
- ✅ **Animated Timeline** - Watch temperature changes evolve over time
- ✅ **Playback Controls** - Play, pause, and control animation speed
- ✅ **Loop Mode** - Continuous playback option

### Data Selection (Priority 1-3)
- ✅ **Area Selection** - Click and drag to select specific regions on the map
- ✅ **Latitude Selection** - Select entire latitude bands for analysis
- ✅ **Multiple Groups** - Create and compare different area groups
- ✅ **Group Management** - Add, remove, and customize groups with colors

### Visualization Views (Priority 1-3)
- ✅ **Interactive Map** - Color-coded temperature anomalies on world map
- ✅ **Line & Bar Charts** - Temporal evolution of selected areas
- ✅ **Histogram View** - Temperature distribution by longitude for selected latitudes
- ✅ **Heatmap View** - Year vs. Latitude visualization with interactive cells
- ✅ **Flexible Layout** - Toggle views on/off and arrange them in column or grid layout

### Interactivity (Priority 1-3)
- ✅ **Cross-View Updates** - Clicking on graphs updates the map year
- ✅ **Synchronized Highlighting** - Selection in one view highlights in others
- ✅ **Responsive Design** - Adapts to different screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lroliver03/react-world-temperature-map.git

# Navigate to project directory
cd react-world-temperature-map-main

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/react-world-temperature-map`

### Build for Production

```bash
npm run build
```

## 📊 Data Source

Temperature anomaly data is sourced from [NASA GISS](https://data.giss.nasa.gov/gistemp/). The dataset contains:
- **Time Range**: 1880-2025
- **Spatial Resolution**: 4° latitude × 4° longitude
- **Anomaly Base**: Average temperatures from 1951-1980

## 🛠️ Technologies

- **Frontend**: React 19.2, TypeScript
- **State Management**: Redux Toolkit
- **Charts**: Recharts
- **Build Tool**: Vite
- **Styling**: CSS with custom properties
- **Font**: Fira Mono (monospace), Inter (sans-serif)

## 🎨 Design Philosophy

The application follows a modern, professional design approach:
- **Clean Interface** - Minimalist design focusing on data
- **Consistent Typography** - Fira Mono for technical elements
- **Professional Color Scheme** - Dark theme with blue accent colors
- **Smooth Animations** - Subtle transitions for better UX
- **Responsive Layout** - Adapts to different screen sizes

## 📁 Project Structure

```
src/
├── assets/          # Data files and images
├── Controls/        # Animation controls
├── Graph/           # Chart components
├── Header/          # Application header
├── Heatmap/         # Heatmap visualization
├── Histogram/       # Histogram view
├── hooks/           # Redux slices and hooks
├── Map/             # World map component
├── SelectionManager/# Selection management UI
├── store/           # Redux store
├── util/            # Utility functions
└── ViewLayout/      # Layout management
```

## 👥 Contributors

Developed by:
- [Nessout](https://github.com/Nessout)
- [lroliver03](https://github.com/lroliver03)

## 📜 License

This project is part of the ISI (Interactive Systems Engineering) course at IMT Atlantique.

## 🙏 Acknowledgments

- NASA GISS for providing the temperature data
- IMT Atlantique for the project framework
- The React and Redux communities for excellent tools and documentation

---

Made with ❤️ for climate data visualization