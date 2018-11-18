const initialState = {
  latitude: 0,
  longitude: 0
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_LOCATION":
      return { ...state,
        latitude: action.payload.position.coords.latitude,
        longitude: action.payload.position.coords.longitude,
      };
    default:
      return state;
  }
};

export default locationReducer;
