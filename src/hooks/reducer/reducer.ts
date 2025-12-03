import { combineReducers } from "redux";
import mapControlsReducer from "../control/mapControlSlice";
import selectGroupReducer from "../select/selectGroupSlice";

// Create rootReducer with combineReducers to prepare for future slices
const rootReducer = combineReducers({
  controls: mapControlsReducer,
  select: selectGroupReducer
});

export default rootReducer;