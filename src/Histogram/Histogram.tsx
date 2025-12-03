import './Histogram.css';
import { useAppSelector } from "../hooks/storeHooks";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { jsondata } from "../assets/data/data";

interface HistogramData {
  longitude: number;
  value: number;
  label: string;
}

export function Histogram() {
  const [selected_bar, setSelectedBar] = useState<number | null>(null);
  const year = useAppSelector((state) => state.controls.year);
  const selected_latitudes = useAppSelector((state) => state.select.selected_latitudes || []);

  // Calculer les données pour l'histogramme
  const getHistogramData = (): HistogramData[] => {
    if (selected_latitudes.length === 0) {
      return [];
    }

    const longitude_data: { [lon: number]: { sum: number; count: number } } = {};

    // Parcourir toutes les cellules pour les latitudes sélectionnées
    jsondata.tempdata.forEach((cell: any) => {
      if (selected_latitudes.includes(cell.lat)) {
        const year_data = cell.data[year];
        if (year_data !== "NA") {
          const value = parseFloat(year_data);
          if (!longitude_data[cell.lon]) {
            longitude_data[cell.lon] = { sum: 0, count: 0 };
          }
          longitude_data[cell.lon].sum += value;
          longitude_data[cell.lon].count += 1;
        }
      }
    });

    // Calculer les moyennes et créer les données pour le graphique
    return Object.keys(longitude_data)
      .map((lon) => {
        const longitude = parseFloat(lon);
        const avg = longitude_data[longitude].sum / longitude_data[longitude].count;
        return {
          longitude: longitude,
          value: avg,
          label: `${longitude}°`
        };
      })
      .sort((a, b) => a.longitude - b.longitude);
  };

  const histogram_data = getHistogramData();

  const handleBarClick = (data: any) => {
    const longitude = data.activePayload?.[0]?.payload?.longitude;
    if (!longitude && longitude !== 0) return;
    
    setSelectedBar(selected_bar === longitude ? null : longitude);

    // Mettre en surbrillance les cellules correspondantes sur la carte
    if (selected_bar !== longitude) {
      // Supprimer la surbrillance précédente
      document.querySelectorAll('.world-map-cell-histogram-highlight').forEach((el) => {
        el.classList.remove('world-map-cell-histogram-highlight');
      });

      // Ajouter la surbrillance pour la nouvelle longitude
      selected_latitudes.forEach((lat) => {
        const cell = document.querySelector(`.world-map-lat-${lat}.world-map-lon-${longitude}`);
        if (cell) {
          cell.classList.add('world-map-cell-histogram-highlight');
        }
      });
    } else {
      // Supprimer toute la surbrillance
      document.querySelectorAll('.world-map-cell-histogram-highlight').forEach((el) => {
        el.classList.remove('world-map-cell-histogram-highlight');
      });
    }
  };

  return (
    <div className="histogram-container">
      <h3>Temperature Anomalies by Longitude ({year})</h3>
      {selected_latitudes.length === 0 ? (
        <p className="histogram-message">
          Please select latitudes on the map to display the histogram.
        </p>
      ) : histogram_data.length === 0 ? (
        <p className="histogram-message">No data available for the selected latitudes.</p>
      ) : (
        <>
          <p className="histogram-subtitle">
            Selected latitudes: {selected_latitudes.map(lat => `${lat}°`).join(', ')}
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={histogram_data} onClick={handleBarClick}>
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={Math.floor(histogram_data.length / 20)}
              />
              <YAxis
                label={{ value: 'Temperature Anomaly (°C)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}°C`, 'Anomaly']}
              />
              <Bar dataKey="value" cursor="pointer">
                {histogram_data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      selected_bar === entry.longitude
                        ? '#ff6b6b'
                        : entry.value > 0
                        ? '#ff7f0e'
                        : '#1f77b4'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
