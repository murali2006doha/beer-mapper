export function getLocation() {
  return function(dispatch) {

    const geolocation = navigator.geolocation;

    const location = new Promise((resolve, reject) => {
      if (!geolocation) {
        reject(new Error('Not Supported'));
      }
      geolocation.getCurrentPosition((position) => {
        dispatch(fetchLocation(position));
        resolve(position);
      }, () => {
        reject(new Error('Permission denied'));
      });
    });
  }
}

export const fetchLocation = position => ({type: "GET_LOCATION", payload: {
    position
  }});
