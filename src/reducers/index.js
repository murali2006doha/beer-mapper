import {
  combineReducers
} from "redux"
import locationReducer from "./locationReducer"
import storeReducer from "./storeReducer"

const reducer = combineReducers({
  store: storeReducer,
  location: locationReducer
})

export default reducer
