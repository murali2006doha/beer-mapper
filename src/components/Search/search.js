import React, {Component} from 'react';
import logo from '../../St_Patricks_beers_and_bottle_5731.svg';
import './search.css';
import {
  Header,
  Icon,
  Container,
  Input,
  Button,
  Image,
  Grid,
  Segment,
  Divider,
  List,
  Card
} from 'semantic-ui-react'
import {geolocated} from 'react-geolocated';
import * as location from "../../actions/locationActions"
import * as store from "../../actions/storeActions"
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';
import {connect} from "react-redux"

const API_KEY = 'MDpiOTFlNTFmYy1lOWI1LTExZTgtOTQ5NS0zN2QzMDJjNWFmZjE6eFlZQTIzNVMyYnlGQVJSUXVqSGpiTHFNTTNjM1JvVXZ1Q2g3'

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClicked = this.onMapClicked.bind(this);
    this.state = {
      data: null,
      inputValue: "",
      currentProduct: {},
      currentStore: {},
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      nearestStores: {}
    };
  }

  onMarkerClick(props, marker, e) {
    this.setState({selectedPlace: props, activeMarker: marker, showingInfoWindow: true});
  }

  onMapClicked(props) {
    if (this.state.showingInfoWindow) {
      this.setState({showingInfoWindow: false, activeMarker: null})
    }
  }

  updateInputValue(evt) {
    this.setState({inputValue: evt.target.value});
  }

  handleSearchInput() {
    if (this.state.inputValue !== undefined) {
      this.props.dispatch(store.getProducts(this.state.inputValue))
    }
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.handleSearchInput()
    }
  }

  componentWillMount() {
    this.props.dispatch(location.getLocation())
  }

  displaySearchResults() {
    var elements = []
    for (var i = 0; i < Math.min(10, this.props.products.length); i++) {
      const id = this.props.products[i].id
      const currentP = this.props.products[i]
      elements.push(<Card onClick={() => {
          this.setState({currentProduct: currentP})
          this.props.dispatch(store.getStores(this.props.latitude, this.props.longitude, id))
        }} fluid="fluid">
        <Card.Content className="card-content">
          <Card.Header>{i + 1}</Card.Header>
          <Card.Description>{this.props.products[i].name + " " + this.props.products[i].package}</Card.Description>
          <Image className="card-image" src={this.props.products[i].image_thumb_url}/>
        </Card.Content>
      </Card>)
    }
    return elements
  }

  displayStoreResults() {
    var elements = []

    for (var i = 0; i < Math.min(10, this.props.stores.length); i++) {
      elements.push(<Card fluid="fluid">
      <Card.Content className="card-content">
          <Card.Header>{i + 1}</Card.Header>
          <Card.Description>{this.props.stores[i].name}</Card.Description>
          <Card.Description>{this.props.stores[i].address_line_1 + ", " + this.props.stores[i].city}</Card.Description>
          <Card.Description>{"Quantity: " + this.props.stores[i].quantity}</Card.Description>
        </Card.Content>
      </Card>)
    }

    return elements
  }

  displayMarkers() {
    var elements = []

    for (var i = 0; i < Math.min(10, this.props.stores.length); i++) {
      elements.push(<Marker onClick={this.onMarkerClick} quantity={this.props.stores[i].quantity} id={this.props.stores[i].id} name={this.props.stores[i].name} loc={this.props.stores[i].address_line_1} position={{
          lat: this.props.stores[i].latitude,
          lng: this.props.stores[i].longitude
        }}/>)
    }
    return elements
  }

  render() {
    return (<div className="App">

      <Container onClick={() => window.location.reload()} className="header-container">
        <Image size='small' src={logo} className="App-logo" alt="logo"/>
        <Header className="title" as='h1'>BEER MAPPER</Header>
      </Container>
      <Container>
        <Input className="search-bar" onKeyPress={this.handleKeyPress} onChange={evt => this.updateInputValue(evt)} action={<Button onClick = {
            this.handleSearchInput
          }
          type = 'submit' > Search</Button>} icon='search' iconPosition='left' placeholder='Ex. Bud Light...'/>
        <header className="App-header">
          <Card.Group className="card-group">
            {
              this.props.products.length !== 0 && this.props.stores.length === 0
                ? <div className="results-div">
                    <h5 className="h5-text">Select an item</h5>
                    {this.displaySearchResults()}
                  </div>
                : ""
            }
          </Card.Group>
          <Card.Group className="card-group">
            {
              this.props.stores.length !== 0
                ? <div className="results-div">
                    <h5 className="h5-text">{"Here are the nearest stores where you can find " + this.state.currentProduct.name + ". See map below!"}
                    </h5>
                    {this.displayStoreResults()}
                  </div>
                : ""
            }

          </Card.Group>
          <Container className="results-container">
            <Map item="item" xs={12} google={this.props.google} onClick={this.onMapClick} zoom={14} initialCenter={{
                lat: 43.6580777,
                lng: -79.38292
              }}>

              {
                this.props.stores.length === 0
                  ? ""
                  : this.displayMarkers()
              }

              <Marker position={{
                  lat: this.props.latitude,
                  lng: this.props.longitude
                }}
                icon={{
                  url: "https://img.icons8.com/color/50/000000/street-view.png",
                  anchor: this.props.google.maps.Point(0,0),
                  scaledSize: this.props.google.maps.Size(32, 32)
                }}/>
              <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
                <div style={{color: 'black'}}>
                  <p>{this.state.selectedPlace.name}</p>
                  <p>{this.state.selectedPlace.loc}</p>
                  <p>{"Quantity: " + this.state.selectedPlace.quantity}</p>
                </div>
              </InfoWindow>
            </Map>
          </Container>
        </header>
      </Container>
    </div>);
  }
}

const mapStateToProps = (state) => ({longitude: state.location.longitude, latitude: state.location.latitude, products: state.store.products, stores: state.store.stores})

const WrappedContainer = GoogleApiWrapper({apiKey: "AIzaSyCPvTfKWSbj5RpHZyWyke-CQ8CR1sqiDH0"})(Search);

export default connect(mapStateToProps)(WrappedContainer)
