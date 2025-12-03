import { jsondata } from "../../assets/data/data";
import { getRandomColor } from "../../util/randomColor";
import type { SelectGroupAction } from "./selectGroupActions";

export type Cell = {
  lat: number,
  lon: number
}

export type CellGroup = {
  cells: Cell[],
  data: {[year: number]: number},
  name: string,
  index: number,
  color: string
}

interface SelectGroupSlice {
  groups: CellGroup[],
  selected: Cell[],
  selected_latitudes: number[]
}

const initialSelectGroup: SelectGroupSlice = {
  groups: [],
  selected: [],
  selected_latitudes: []
}

function getEarliestIndex(groups: CellGroup[]) {
  let min_index: number = 0; // Start counting at zero
  while (groups.filter((group) => (group.index == min_index)).length > 0) min_index += 1; // Run filters iteratively to find matching groups with matching index
  return min_index; // Return first index that doesn't match any group
}

export default function selectGroupReducer(state: SelectGroupSlice = initialSelectGroup, action: SelectGroupAction) {
  switch (action.type) {
    case 'select/selectCell': // Select cell

      // If cell is already selected, make no changes
      if (state.selected.filter((cell) => ((cell.lat == action.payload.cell.lat) && (cell.lon == action.payload.cell.lon))).length > 0)
        return state;

      // Add class selected to respective div
      document.querySelector(`.world-map-lat-${action.payload.cell.lat}.world-map-lon-${action.payload.cell.lon}`)?.classList.add('world-map-cell-selected');
      
      return {
        ...state,
        selected: state.selected.concat(action.payload.cell)
      };
    case 'select/clearSelection': // Clears selected cells array
      document.querySelectorAll('.world-map-cell-selected').forEach((el) => el.classList.remove('world-map-cell-selected'));
      return {
        ...state,
        selected: []
      };
    case 'select/createGroup': // Creates new group and pushes to group array

      // If no selected cells or too many groups, do nothing
      if (state.selected.length == 0 || state.groups.length > 10) 
        return state;

      // Create group
      let new_group: CellGroup = {
        cells: state.selected,
        data: {},
        name: `Group ${state.groups.length + 1}`,
        index: getEarliestIndex(state.groups),
        color: getRandomColor()
      }

      document.documentElement.style.setProperty(`--world-map-group-${new_group.index}-color`, new_group.color);

      // Create group data object for average variation
      const coordinates = new_group.cells.map(
        (cell) => ({lat: cell.lat, lon: cell.lon})
      );

      const group_data: any = {};
      [...Array(146).keys()].forEach((v) => {
        let new_v = v + 1880;
        group_data[new_v] = 0;
      })

      jsondata.tempdata.filter( // Get data only from selected cells
        (coord: any) => (coordinates.reduce((accumulator, current) => (accumulator || ((current.lat == coord.lat) && (current.lon == coord.lon))), false))
      ).forEach((cell: any) => {
        [...Array(146).keys()].map((v) => (v + 1880)).forEach(
          (index) => { // Store average data for each year
            if (cell.data[index] != "NA")
              group_data[index] += cell.data[index]/new_group.cells.length;
          }
        )
      });

      new_group.data = group_data;

      // Deselect all currently selected cells
      const elements = document.querySelectorAll('.world-map-cell-selected');
      elements.forEach((el) => {
        el.classList.remove('world-map-cell-selected');
        el.classList.add(`world-map-group-${new_group.index}`);
      });

      return {
        ...state,
        selected: [],
        groups: state.groups.concat(new_group)
      }
    case 'select/deleteGroup':
      // Deletes group from group array
      const group_to_delete = state.groups.find(g => g.index === action.payload.index);
      if (group_to_delete) {
        // Supprimer les classes CSS des cellules du groupe
        const group_class_name = `world-map-group-${action.payload.index}`;
        document.querySelectorAll(`.${group_class_name}`).forEach((el) => {
          el.classList.remove(group_class_name);
        });
      }
      
      return {
        ...state,
        groups: state.groups.filter(group => group.index !== action.payload.index)
      };
    case 'select/addToGroup':
      // Adds cell(s) to specific group
    case 'select/removeFromGroup':
      // Removes cell(s) from specific group
    case 'select/clearGroups': // Clears all groups

      state.groups.forEach(
        (group) => {
          const group_class_name = `world-map-group-${group.index}`
          const elements = document.querySelectorAll('.' + group_class_name);
          elements.forEach((el) => el.classList.remove(group_class_name));
        }
      )

      return {
        ...state,
        groups: []
      };
    case 'select/setGroupName': {// Sets group color for group with specific index

        // Get index of group in array
        const index = state.groups.findIndex((group) => (group.index == action.payload.index));

        // Create new array and copy all elements of original groups array into new array
        const groups: CellGroup[] = [];
        state.groups.forEach((group) => groups.push({...group})); // Without copying each individual group object, the state is modified directly
        
        // Changes color of desired group in array copy
        groups[index].name = action.payload.name;

        return {
          ...state,
          groups: groups
        }
      }
    case 'select/setGroupColor': // Sets group color for group with specific index

      // Get index of group in array
      const index = state.groups.findIndex((group) => (group.index == action.payload.index));

      // Create new array and copy all elements of original groups array into new array
      const groups: CellGroup[] = [];
      state.groups.forEach((group) => groups.push({...group})); // Without copying each individual group object, the state is modified directly
      
      // Changes color of desired group in array copy
      groups[index].color = action.payload.color;

      // Sets CSS property
      document.documentElement.style.setProperty(`--world-map-group-${action.payload.index}-color`, action.payload.color);
      
      // Returns state with copied groups array in place of the old one
      return {
        ...state,
        groups: groups
      };
    case 'select/selectLatitude': // Select a latitude for histogram view
      if (state.selected_latitudes.includes(action.payload.latitude)) {
        return state; // Already selected
      }
      return {
        ...state,
        selected_latitudes: [...state.selected_latitudes, action.payload.latitude]
      };
    case 'select/deselectLatitude': // Deselect a latitude
      return {
        ...state,
        selected_latitudes: state.selected_latitudes.filter(lat => lat !== action.payload.latitude)
      };
    case 'select/clearLatitudes': // Clear all selected latitudes
      return {
        ...state,
        selected_latitudes: []
      };
    default:
      return state;
  }
}