const initialState = {
  stores: [],
  products: [],
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_STORES":
      return { ...state,
        stores: action.payload.json.data.result,
      };
    case "GET_PRODUCTS":
      return { ...state,
        products: action.payload.json.data.result,
      };
    default:
      return state;
  }
};

export default storeReducer;
