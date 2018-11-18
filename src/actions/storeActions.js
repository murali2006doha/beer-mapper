import axios from 'axios';

const API_KEY = 'MDpiOTFlNTFmYy1lOWI1LTExZTgtOTQ5NS0zN2QzMDJjNWFmZjE6eFlZQTIzNVMyYnlGQVJSUXVqSGpiTHFNTTNjM1JvVXZ1Q2g3'

export function getProducts(keyword) {
  return dispatch => {

    var query = keyword.split(' ').join('+');
    axios.get('https://lcboapi.com/products?q=' + query + '&access_key=' + API_KEY).then(response => {
      console.log(response)
      dispatch(fetchProducts(response));
    }).catch((error) => {
      console.log(error)
    });
  }
}

export function getStores(lat, long, id) {
  return dispatch => {
    axios.get('https://lcboapi.com/stores?lat=' + lat + '&lon=' + long + '&product_id=' + id + '&access_key=' + API_KEY).then(response => {
      dispatch(fetchStores(response));
    }).catch((error) => {
      console.log(error)
    });
  }
}

export const fetchStores = json => ({type: "GET_STORES", payload: {
    json
  }});

export const fetchProducts = json => ({type: "GET_PRODUCTS", payload: {
    json
  }});
