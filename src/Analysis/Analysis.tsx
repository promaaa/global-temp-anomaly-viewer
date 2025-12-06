import { useMemo } from 'react';
import { jsondata } from '../assets/data/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useAppSelector } from '../hooks/storeHooks';
import { store } from '../store/store';
import './Analysis.css';

interface AnnualData {
    year: number;
    avgAnomaly: number;
    northAnomaly: number;
    southAnomaly: number;
}

interface DecadalData {
    decade: string;
    avgAnomaly: number;
}

export function Analysis() {
    const currentYear = useAppSelector((state) => state.controls.year);

    const annualData: AnnualData[] = useMemo(() => {
        if (!jsondata || !jsondata.tempdata) return [];

        const startYear = 1880;
        const endYear = 2025;
        const data: AnnualData[] = [];

        for (let year = startYear; year <= endYear; year++) {
            let totalWeightedAnomaly = 0;
            let totalWeight = 0;
            let totalWeightedAnomalyN = 0;
            let totalWeightN = 0;
            let totalWeightedAnomalyS = 0;
            let totalWeightS = 0;

            jsondata.tempdata.forEach((point: any) => {
                const anomaly = point.data[year];
                if (anomaly !== "NA") {
                    const weight = Math.cos(point.lat * Math.PI / 180);
                    totalWeightedAnomaly += anomaly * weight;
                    totalWeight += weight;

                    if (point.lat >= 0) {
                        totalWeightedAnomalyN += anomaly * weight;
                        totalWeightN += weight;
                    } else {
                        totalWeightedAnomalyS += anomaly * weight;
                        totalWeightS += weight;
                    }
                }
            });

            if (totalWeight > 0) {
                data.push({
                    year,
                    avgAnomaly: totalWeightedAnomaly / totalWeight,
                    northAnomaly: totalWeightN > 0 ? totalWeightedAnomalyN / totalWeightN : 0,
                    southAnomaly: totalWeightS > 0 ? totalWeightedAnomalyS / totalWeightS : 0
                });
            }
        }
        return data;
    }, []);

    const decadalData: DecadalData[] = useMemo(() => {
        const decades: { [key: string]: number[] } = {};
        annualData.forEach(d => {
            const decade = Math.floor(d.year / 10) * 10;
            const decadeLabel = `${decade}s`;
            if (!decades[decadeLabel]) decades[decadeLabel] = [];
            decades[decadeLabel].push(d.avgAnomaly);
        });

        return Object.entries(decades).map(([decade, values]) => ({
            decade,
            avgAnomaly: values.reduce((a, b) => a + b, 0) / values.length
        })).sort((a, b) => a.decade.localeCompare(b.decade));
    }, [annualData]);

    const regressionData = useMemo(() => {
        if (annualData.length === 0) return [];

        const n = annualData.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;

        annualData.forEach(d => {
            sumX += d.year;
            sumY += d.avgAnomaly;
            sumXY += d.year * d.avgAnomaly;
            sumXX += d.year * d.year;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return annualData.map(d => ({
            year: d.year,
            trend: slope * d.year + intercept,
            slope // keep slope for display if needed
        }));
    }, [annualData]);

    const combinedData = useMemo(() => {
        return annualData.map((d, i) => ({
            ...d,
            trend: regressionData[i]?.trend
        }));
    }, [annualData, regressionData]);

    const extremeEvents = useMemo(() => {
        const sorted = [...annualData].sort((a, b) => b.avgAnomaly - a.avgAnomaly);
        const warmest = sorted.slice(0, 5);
        const coldest = sorted.slice(-5).reverse();
        return { warmest, coldest };
    }, [annualData]);

    const trendSlope = regressionData.length > 0 ? regressionData[0].slope : 0;

    // Handler for chart clicks - change year on the map
    const handleChartClick = (e: any) => {
        if (e && e.activeLabel) {
            const year = parseInt(e.activeLabel);
            if (!isNaN(year) && year >= 1880 && year <= 2025) {
                store.dispatch({
                    type: 'control/map/changeYear',
                    payload: year
                });
            }
        }
    };

    // Handler for year click in extreme events list
    const handleYearClick = (year: number) => {
        store.dispatch({
            type: 'control/map/changeYear',
            payload: year
        });
    };

    if (annualData.length === 0) return <div>Loading data...</div>;

    return (
        <div className="analysis-container">
            <div className="analysis-header">
                <h2>Extra metrics</h2>
                <div className="current-year-indicator">
                    Selected Year: <span className="highlight">{currentYear}</span>
                </div>
            </div>

            <div className="analysis-section">
                <div className="section-header">
                    <h3>Global Temperature Trend</h3>
                    <div className="trend-stat">
                        Warming Trend: <span className="highlight">+{(trendSlope * 10).toFixed(3)}°C / decade</span>
                    </div>
                </div>

                <div className="chart-section">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={combinedData} onClick={handleChartClick}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis label={{ value: 'Anomaly (°C)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <ReferenceLine x={currentYear} stroke="#ff4444" strokeWidth={2} strokeDasharray="3 3" label={{ value: currentYear.toString(), position: 'top', fill: '#ff4444' }} />
                            <Line type="monotone" dataKey="avgAnomaly" stroke="#8884d8" dot={false} name="Global Avg" strokeWidth={2} />
                            <Line type="monotone" dataKey="trend" stroke="#ff7300" dot={false} name="Linear Trend" strokeDasharray="5 5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="analysis-section">
                <h3>Hemispheric Comparison</h3>
                <p className="section-desc">Comparing temperature anomalies between Northern and Southern hemispheres.</p>
                <div className="chart-section">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={combinedData} onClick={handleChartClick}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis label={{ value: 'Anomaly (°C)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <ReferenceLine x={currentYear} stroke="#ff4444" strokeWidth={2} strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="northAnomaly" stroke="#e74c3c" dot={false} name="Northern Hemisphere" strokeWidth={1.5} />
                            <Line type="monotone" dataKey="southAnomaly" stroke="#3498db" dot={false} name="Southern Hemisphere" strokeWidth={1.5} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="analysis-section">
                <h3>Decadal Averages</h3>
                <p className="section-desc">Average temperature anomaly per decade, highlighting the accelerating warming.</p>
                <div className="chart-section">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={decadalData} onClick={handleChartClick}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="decade" />
                            <YAxis label={{ value: 'Avg Anomaly (°C)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="step" dataKey="avgAnomaly" stroke="#2ecc71" strokeWidth={3} name="Decadal Average" dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="stats-section">
                <div className="extreme-events warmest">
                    <h4>Warmest Years</h4>
                    <ul>
                        {extremeEvents.warmest.map(d => (
                            <li key={d.year} className="clickable-year" onClick={() => handleYearClick(d.year)}>
                                <span className="year">{d.year}</span>
                                <span className="value">+{d.avgAnomaly.toFixed(3)}°C</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="extreme-events coldest">
                    <h4>Coldest Years</h4>
                    <ul>
                        {extremeEvents.coldest.map(d => (
                            <li key={d.year} className="clickable-year" onClick={() => handleYearClick(d.year)}>
                                <span className="year">{d.year}</span>
                                <span className="value">{d.avgAnomaly.toFixed(3)}°C</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

