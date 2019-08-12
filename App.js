/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { StyleSheet, View, Text, Dimensions, Image, ActivityIndicator, Modal } from "react-native";
import axios from 'axios';
import ProgressWrapper from "./components/ProgressWrapper";
import WallpapersList from "./components/WallpapersList";
import { Appbar, Button } from 'react-native-paper';

const {height, width} = Dimensions.get('window');

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      wallpapers: [],
      infoModalvisible: false,
    }

    this.unsplashApiURL = "https://api.unsplash.com/photos/random?client_id=c14632aed2433947ffa94b19b0bc8ce33d99db554f74fb178c864b527b409588&count=30";
  }

  setModalVisible = () => {
    console.log("toggled")
    this.setState({ infoModalvisible: true });
  }

  dismissModal = () => {
    this.setState({ infoModalvisible: false });
  }

  componentDidMount() {
    this.loadWallpapers();
  }

  loadWallpapers = () => {

    this.setState({ isLoading: true });

    axios.get(this.unsplashApiURL)
        .then(res => {
          console.log(res.data);
          return this.setState({ wallpapers: res.data, isLoading: false });
        })
        .catch(err => {
          this.setState({ isLoading: true });
          return console.log(err);
        })
  }

  // wallpaper list item
  renderWallpaperListItems = ({item}) => {
    return (
      <View style={{ flex: 1 }}>
        <View 
          style={{ 
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center"
           }}>
             <ActivityIndicator size="large" color="grey" />
          </View>
          
          <View style={{ width, height }}>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.infoModalvisible}
              onRequestClose={() => this.dismissModal()}
            >
              <Text>Hello World!</Text>
            </Modal>

            <Image 
              style={{ flex: 1, height: null, width: null }}
              source={{ uri: item.urls.regular }}
              resizeMode="cover" />

              <Appbar style={styles.bottomAppbar}> 
                <Appbar.Action icon="info" onPress={() => this.setModalVisible} />  
                <Appbar.Action icon="save" onPress={() => console.log('Pressed mail')} />
                <Appbar.Action icon="share" onPress={() => console.log('Pressed label')} /> 
              </Appbar>
          </View>

      </View>
    )
  }

  render() {
    return (
      <View style={{ width, height }}>

        {!this.state.isLoading ? (
          <WallpapersList renderWallpaperListItems={this.renderWallpaperListItems} wallpapers={this.state.wallpapers} />
        ) : (
          <View 
            style={{ 
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ActivityIndicator size="large" color="grey" />
          </View>
        )}

      </View>
    )
  } 
}

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
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomAppbar: {
    position: "relative",
    zIndex: 999,
    width: width,
    bottom: 23,
    justifyContent: "space-around",
  }
});

export default App;
