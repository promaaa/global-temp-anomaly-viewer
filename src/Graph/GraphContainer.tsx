import './GraphContainer.css';
import '../Map/groups.css';
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/storeHooks"
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine, BarChart, Bar, Legend } from "recharts";
import { store } from '../store/store';
import { Link, useSearchParams } from 'react-router-dom';

interface ChartData {
  name: string,
  [group_data: string]: number | string
}

function LineChartComponent({data}: {data: ChartData[]}) {

  const year = useAppSelector((state) => (state.controls.year));
  const groups = useAppSelector((state) => (state.select.groups));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}
        onClick={(e) => 
          store.dispatch({
            type: 'control/map/changeYear',
            payload: parseInt(e.activeLabel as string)
          })
        }
      >
        <Tooltip />
        <Legend />
        <XAxis dataKey="name" />
        <YAxis type='number' domain={['auto', 'auto']} tickCount={9} />
        <CartesianGrid strokeDasharray="4 4" />
        <ReferenceLine x={year.toString()} stroke='darkgray' />
        {
          groups.map((group) => (
            <Line 
              key={group.index} 
              dataKey={group.name} 
              stroke={group.color}
              strokeWidth={2}
              dot={{ fill: group.color, r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))
        }
      </LineChart>
    </ResponsiveContainer>
  )
}

function BarChartComponent({data}: {data: ChartData[]}) {

  const year = useAppSelector((state) => (state.controls.year));
  const groups = useAppSelector((state) => (state.select.groups));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}
        onClick={(e) => 
          store.dispatch({
            type: 'control/map/changeYear',
            payload: parseInt(e.activeLabel as string)
          })
        }
      >
        <Tooltip />
        <Legend />
        <XAxis dataKey="name" />
        <YAxis domain={['auto', 'auto']} tickCount={9} />
        <CartesianGrid strokeDasharray="4 4" />
        <ReferenceLine x={year.toString()} strokeWidth={8} stroke='lightgray' zIndex={-1} />
        {
          groups.map((group) => (
            <Bar 
              key={group.index} 
              dataKey={group.name} 
              fill={group.color}
            />
          ))
        }
      </BarChart>
    </ResponsiveContainer>
  )
}

export function GraphContainer() {

  const [ data, setData ] = useState<ChartData[]>([]);
  const [ chart_domain, setChartDomain ] = useState<{min: number, max: number}>({min: 1880, max: 2025});
  const [ search_params, _ ] = useSearchParams({ chart_type: 'line' });
  const groups = useAppSelector((state) => (state.select.groups));

  function getChart(type: string | null) {
    switch (type) {
      case 'line':
        return <LineChartComponent data={data.slice(chart_domain.min - 1880, chart_domain.max - 1879)} />
      case 'bar':
        return <BarChartComponent data={data.slice(chart_domain.min - 1880, chart_domain.max - 1879)} />
      default:
        return (<h1>No Chart Type</h1>)
    }
  }

  function updateData() {
    let new_data: ChartData[] = [];

    for (let i = 1880; i <= 2025; ++i)
      new_data.push({
        name: i.toString()
      });

    groups.forEach((group) => {
      Object.keys(group.data).forEach((year: string, index) => {

        if (new_data[index].name != year.toString())
          console.error(`Data reformatting mismatch! At data index ${index} (year ${year}).`);

        new_data[index][group.name] = group.data[parseInt(year)];
      })
    })

    setData(new_data);

    console.log("Groups state changed!");
  }

  useEffect(updateData, [groups]);

  return (
    <div className='graph-container'>
      <section className='chart-link-container'>
        <nav>
          <Link className={'chart-link' + ((search_params.get('type') == 'line')?' active':'')} to="/react-world-temperature-map/?type=line">Line Chart</Link>
          <Link className={'chart-link' + ((search_params.get('type') == 'bar')?' active':'')} to="/react-world-temperature-map/?type=bar">Bar Chart</Link>
        </nav>
      </section>

      <section>
        From <input type='number' max={2025} min={1880} defaultValue={1880} onChange={
          (e) => {
            const value: number = parseInt(e.target.value);
            setChartDomain({
              ...chart_domain,
              min: (
                (value < 1880) ? 1880 : (value > 2025) ? 2025 : value
              )
            });
          }
        } /> to <input type='number' max={2025} min={1880} defaultValue={2025} onChange={
          (e) => {
            const value: number = parseInt(e.target.value);
            setChartDomain({
              ...chart_domain,
              max: (
                (value < 1880) ? 1880 : (value > 2025) ? 2025 : value
              )
            });
          }
        } />
      </section>

      {
        getChart(search_params.get('type'))
      }
    </div>
  )
}