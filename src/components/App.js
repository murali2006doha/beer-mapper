import React, {Component} from 'react';
import Search from "./Search/search";


import { Provider } from "react-redux";
import store from "../store/index";

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
      <Search/>
      </Provider>
    );
  }
}

export default (Root)
