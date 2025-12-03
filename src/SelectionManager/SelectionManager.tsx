import './SelectionManager.css';
import { useAppSelector } from "../hooks/storeHooks";
import { store } from "../store/store";

export function SelectionManager() {
  const selected_latitudes = useAppSelector((state) => state.select.selected_latitudes || []);
  const groups = useAppSelector((state) => state.select.groups);
  const selected_cells = useAppSelector((state) => state.select.selected);

  function removeLatitude(lat: number) {
    store.dispatch({
      type: 'select/deselectLatitude',
      payload: { latitude: lat }
    });
    
    // Supprimer la classe CSS de sélection
    const latButton = document.querySelector(`.latitude-selection-button.--lat${lat}`);
    latButton?.classList.remove('latitude-selected');
  }

  function removeGroup(index: number) {
    // Supprimer les classes CSS des cellules du groupe
    const group_class_name = `world-map-group-${index}`;
    document.querySelectorAll(`.${group_class_name}`).forEach((el) => {
      el.classList.remove(group_class_name);
    });

    store.dispatch({
      type: 'select/deleteGroup',
      payload: { index }
    });
  }

  return (
    <div className="selection-manager-container">
      <div className="selection-section">
        <h4>Selected Latitudes ({selected_latitudes.length})</h4>
        {selected_latitudes.length === 0 ? (
          <p className="empty-message">No latitudes selected. Click on latitude buttons on the map to select.</p>
        ) : (
          <div className="latitude-list">
            {selected_latitudes.map((lat) => (
              <div key={lat} className="latitude-item">
                <span>{lat}°</span>
                <button 
                  className="remove-button" 
                  onClick={() => removeLatitude(lat)}
                  title="Remove this latitude"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="selection-section">
        <h4>Selected Cells ({selected_cells.length})</h4>
        {selected_cells.length === 0 ? (
          <p className="empty-message">No cells selected. Click and drag on the map to select areas.</p>
        ) : (
          <div className="cells-info">
            <p>{selected_cells.length} cell(s) selected</p>
            <button 
              className="action-button" 
              onClick={() => store.dispatch({type: 'select/clearSelection'})}
            >
              Clear Selection
            </button>
            <button 
              className="action-button primary" 
              onClick={() => store.dispatch({type: 'select/createGroup'})}
              disabled={selected_cells.length === 0}
            >
              Create Group
            </button>
          </div>
        )}
      </div>

      <div className="selection-section">
        <h4>Groups ({groups.length})</h4>
        {groups.length === 0 ? (
          <p className="empty-message">No groups created. Select cells and create a group to compare data.</p>
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <div key={group.index} className="group-item">
                <div className="group-header">
                  <div 
                    className="group-color-indicator" 
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="group-name">{group.name}</span>
                  <span className="group-count">({group.cells.length} cells)</span>
                  <button 
                    className="remove-button" 
                    onClick={() => removeGroup(group.index)}
                    title="Remove this group"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
