/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from "react";
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Dimensions, Image, TouchableHighlight } from "react-native";
import axios from 'axios';


const {height, width} = Dimensions.get('window');

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      images: [],
      infoWrapperHidden: true,
    }
  }

  componentDidMount() {
    this.loadWallpapers();
  }

  renderItem = ({item}) => {
    return(

      // wrapper
      <View style={{ height, width }}>

          {/* infoContentWrapper */}
          {!this.state.infoWrapperHidden? (
          <View style={styles.infoContentWrapper}>
            <Text>Hello World</Text>            
            <Text>Hello World</Text>            
            <Text>Hello World</Text>            
            <Text>Hello World</Text>            
            <Text>Hello World</Text>            
            <Text>Hello World</Text>            
          </View>) : <View /> }
          
          {/* infoButtonWrapper */}
          <View style={{ 
            position: "absolute", 
            top: 0, 
            right: 0, 
            flex: 1, 
            zIndex: 999, 
            marginTop: 15,
            marginRight: 20 }}
          >
            <TouchableHighlight style={styles.infoButton}>
              <Text style={{ color: "white", fontWeight: "bold" }}>i</Text>
            </TouchableHighlight>
          </View>

          <Image
            style={{ flex: 1, height: null, width: null }}
            source={{ uri: item.urls.regular }}
            resizeMode="cover" />

      {/* /wrapper */}
      </View>

    )
  }

  loadWallpapers = () => {

    axios.get('https://api.unsplash.com/photos/random?count=30&client_id=c14632aed2433947ffa94b19b0bc8ce33d99db554f74fb178c864b527b409588')
        .then(res => {
          console.log(res.data)
          this.setState({ images: res.data, isLoading: false });
        })
        .catch(err => console.log(err))
        .finally(res => console.log("request completed."));

    return console.log("Loading Wallpapers!");
  }

  render() {
    return this.state.isLoading ? (
      <View
        style={{ 
          flex: 1,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center"}}
      >
        
        <ActivityIndicator size="large" color="grey" />
      </View>
    ) : (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <FlatList 
          horizontal
          pagingEnabled
          data={this.state.images}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

};

const styles = StyleSheet.create({
  infoButton: {
    padding: 5,
    height: 30,
    width: 30,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoContentWrapper: {
    width: width,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 998,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.8)'
  }
});

export default App;
