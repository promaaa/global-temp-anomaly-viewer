import { useEffect } from 'react'
import './App.css'
import { Map } from './Map/Map'
import { AnimControls } from './Controls/Controls';
import { jsondata } from './assets/data/data';
import { yearimg } from './assets/img/img';
import { SelectionManager } from './SelectionManager/SelectionManager';
import { ViewLayout } from './ViewLayout/ViewLayout';
import { Header } from './Header/Header';

function App() {

  useEffect(() => {

    if (!jsondata) {
      console.error("Data file not found!");
      return;
    }

    if (!Object.hasOwn(jsondata, 'tempdata')) {
      console.error("Data content not found!");
      return;
    }

    // Freeze jsondata and yearimg objects
    Object.freeze(jsondata);
    Object.freeze(yearimg);
  }, []);

  return (
    <>
      <div className='viewport'>
        <Header />
        <AnimControls />
        <Map />
        <SelectionManager />
        <ViewLayout />
      </div>
    </>
  )
}

export default App
