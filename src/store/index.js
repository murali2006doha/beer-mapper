import { applyMiddleware, createStore } from 'redux';
import reducer from "../reducers"
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"
import logger from "redux-logger"
import { composeWithDevTools } from 'redux-devtools-extension';

const middleware = applyMiddleware(promise(), thunk, logger)
export default createStore(reducer, composeWithDevTools(middleware))
