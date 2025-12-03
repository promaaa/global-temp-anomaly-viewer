import './Heatmap.css';
import { useAppSelector } from "../hooks/storeHooks";
import { useState, useMemo } from "react";
import { jsondata } from "../assets/data/data";
import { store } from "../store/store";

interface HeatmapCell {
  lat: number;
  year: number;
  value: number;
  color: string;
}

export function Heatmap() {
  const [selected_cell, setSelectedCell] = useState<{ lat: number; year: number } | null>(null);
  const year = useAppSelector((state) => state.controls.year);
  const selected_latitudes = useAppSelector((state) => state.select.selected_latitudes || []);

  // Calculer les données de la heatmap
  const heatmap_data = useMemo(() => {
    const all_latitudes = [...Array(45).keys()].map((v) => 4 * v - 88).sort((a, b) => b - a);
    const years = [...Array(146).keys()].map((v) => v + 1880);
    const data: HeatmapCell[] = [];

    all_latitudes.forEach((lat) => {
      years.forEach((year) => {
        // Calculer la moyenne pour cette latitude et cette année
        const cells_at_lat = jsondata.tempdata.filter((cell: any) => cell.lat === lat);
        let sum = 0;
        let count = 0;

        cells_at_lat.forEach((cell: any) => {
          const value = cell.data[year];
          if (value !== undefined && value !== "NA") {
            sum += parseFloat(value.toString());
            count++;
          }
        });

        if (count > 0) {
          const avg = sum / count;
          data.push({
            lat,
            year,
            value: avg,
            color: getColorForValue(avg)
          });
        }
      });
    });

    return data;
  }, []);

  // Fonction pour obtenir la couleur en fonction de la valeur
  function getColorForValue(value: number): string {
    if (value < -2) return '#053061';
    if (value < -1.5) return '#2166ac';
    if (value < -1) return '#4393c3';
    if (value < -0.5) return '#92c5de';
    if (value < 0) return '#d1e5f0';
    if (value < 0.5) return '#fddbc7';
    if (value < 1) return '#f4a582';
    if (value < 1.5) return '#d6604d';
    if (value < 2) return '#b2182b';
    return '#67001f';
  }

  // Gérer le clic sur une cellule
  function handleCellClick(lat: number, year: number) {
    setSelectedCell({ lat, year });

    // Mettre à jour l'année sur la carte
    store.dispatch({
      type: 'control/map/changeYear',
      payload: year
    });

    // Sélectionner la latitude
    store.dispatch({
      type: 'select/selectLatitude',
      payload: { latitude: lat }
    });

    // Mettre en surbrillance la latitude sur la carte
    const latButton = document.querySelector(`.latitude-selection-button.--lat${lat}`);
    if (latButton && !latButton.classList.contains('latitude-selected')) {
      latButton.classList.add('latitude-selected');
    }

    // Mettre en surbrillance toutes les cellules de cette latitude
    document.querySelectorAll(`.world-map-lat-${lat}`).forEach((el) => {
      el.classList.add('world-map-cell-highlight');
    });

    // Supprimer la surbrillance après 2 secondes
    setTimeout(() => {
      document.querySelectorAll('.world-map-cell-highlight').forEach((el) => {
        el.classList.remove('world-map-cell-highlight');
      });
    }, 2000);
  }

  const latitudes = [...Array(45).keys()].map((v) => 4 * v - 88).sort((a, b) => b - a);
  const years = [...Array(146).keys()].map((v) => v + 1880);

  // Filtrer pour n'afficher qu'une année sur 10 sur l'axe X
  const displayed_years = years.filter((_, index) => index % 10 === 0);

  return (
    <div className="heatmap-container">
      <h3>Temperature Anomalies Heatmap (1880-2025)</h3>
      <p className="heatmap-subtitle">
        Years (horizontal) vs Latitudes (vertical). Click on a cell to select that year and latitude.
      </p>

      <div className="heatmap-legend">
        <span className="legend-label">Cold</span>
        <div className="legend-gradient">
          {[-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5].map((val, i) => (
            <div
              key={i}
              className="legend-color"
              style={{ backgroundColor: getColorForValue(val) }}
              title={`${val}°C`}
            />
          ))}
        </div>
        <span className="legend-label">Warm</span>
      </div>

      <div className="heatmap-wrapper">
        <div className="heatmap-y-axis">
          {latitudes.map((lat) => (
            <div key={lat} className="heatmap-y-label">
              {lat}°
            </div>
          ))}
        </div>

        <div className="heatmap-content">
          <div className="heatmap-x-axis">
            {displayed_years.map((year) => (
              <div
                key={year}
                className="heatmap-x-label"
                style={{ left: `${(year - 1880) * 9}px` }}
              >
                {year}
              </div>
            ))}
          </div>

          <div className="heatmap-grid">
            {heatmap_data.map((cell) => {
              const is_selected =
                selected_cell?.lat === cell.lat && selected_cell?.year === cell.year;
              const is_current_year = cell.year === year;
              const is_selected_lat = selected_latitudes.includes(cell.lat);

              return (
                <div
                  key={`${cell.lat}-${cell.year}`}
                  className={`heatmap-cell ${is_selected ? 'selected' : ''} ${
                    is_current_year ? 'current-year' : ''
                  } ${is_selected_lat ? 'selected-latitude' : ''}`}
                  style={{
                    backgroundColor: cell.color,
                    gridRow: latitudes.indexOf(cell.lat) + 1,
                    gridColumn: cell.year - 1879
                  }}
                  onClick={() => handleCellClick(cell.lat, cell.year)}
                  title={`Lat: ${cell.lat}°, Year: ${cell.year}, Anomaly: ${cell.value.toFixed(2)}°C`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
