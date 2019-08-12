/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { StyleSheet, View, Text, Dimensions, Image, ActivityIndicator, Animated, PermissionsAndroid, CameraRoll, Vibration, Linking, Share } from "react-native";
import axios from 'axios';
import ProgressWrapper from "./components/ProgressWrapper";
import WallpapersList from "./components/WallpapersList";
import { Appbar, Button } from 'react-native-paper';

const {height, width} = Dimensions.get('window');
var RNFS = require('react-native-fs');

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      wallpapers: [],
      isImageFocused: false,
    }

    this.unsplashApiURL = "https://api.unsplash.com/photos/random?client_id=c14632aed2433947ffa94b19b0bc8ce33d99db554f74fb178c864b527b409588&count=12";
    this.moveAnimation = new Animated.ValueXY({ x: 0, y: -100 });
  }

  moveInfoWrapper = () => {

    this.setState((state) => ({
      isImageFocused: !this.state.isImageFocused
    }), () => {
      if(this.state.isImageFocused) {
        Animated.spring(this.moveAnimation, {
          toValue: {x: 0, y: 0}
        }).start();
      } else {
        Animated.spring(this.moveAnimation, {
          toValue: {x: 0, y: -150}
        }).start();
      }
    });
  }

  dismissModal = () => {
    this.setState({ infoModalvisible: false });
  }

  componentDidMount() {
    this.loadWallpapers();
  }

  saveToCameraRoll = async (image) => {
    let cameraPermissions = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        "title" : "Terrapapers External Storage Permission",
        "message" : "We need external storage write access to store wallpapers."
      }
    )
    

    if(cameraPermissions) {
      console.log("Camera Permission granted.")
      // let cacheImagePath = RNFS.CachesDirectoryPath()
      // var path = RNFS.DocumentDirectoryPath + image.id + '.jpg';
      RNFS.downloadFile({
        fromUrl : image.urls.regular,
        toFile: `${RNFS.DocumentDirectoryPath}/${image.id}.jpg`
      }).promise.then((r) => {
        
        CameraRoll.saveToCameraRoll(`file://${RNFS.DocumentDirectoryPath}/${image.id}.jpg`)
        Vibration.vibrate();
        
        alert("Hurray! Wallpaper has been saved!");

      }).catch(error => console.log(error));

    } else {
      console.log("Camera permissions denied")
    }
  }

  // ANCHOR shareImage fun
  shareImage = async (image) => {
    try {
      await Share.share({
        message: "Checkout this wallpaper " + image.urls.full + "\n Shared from Terrapapers Wallpapers App."
      });
    } catch (error) {
      console.log(error);
    }
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

    const userURL = item.user.links.html;
    const photoURL = item.links.html;
    const unsplashURL = "https://unsplash.com";

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

           {/* ANCHOR InformationWrapper */}
            <Animated.View style={[styles.infoContentWrapper, this.moveAnimation.getLayout()]}>
              <Text style={{ color: "white" }}>
                {item.description ? item.description : item.alt_description}
              </Text>
              <Text style={{ color: "white", textDecorationLine: "underline", fontWeight: "bold" }} onPress={() => Linking.openURL(userURL)}>
                Photo By: {item.user.name}
              </Text>
              <Text style={{ color: "white", textDecorationLine: "underline", fontWeight: "bold" }} onPress={() => Linking.openURL(unsplashURL)}>
                Uploaded On: unsplash
              </Text>
            </Animated.View>

            <Image 
              style={{ flex: 1, height: null, width: null }}
              source={{ uri: item.urls.regular }}
              resizeMode="cover" />

              <Appbar style={styles.bottomAppbar}> 
                <Appbar.Action icon="info" onPress={() => this.moveInfoWrapper()} />  
                <Appbar.Action icon="save" onPress={() => this.saveToCameraRoll(item)} />
                <Appbar.Action icon="share" onPress={() => this.shareImage(item)} /> 
                <Appbar.Action icon="refresh" onPress={() => this.loadWallpapers()} /> 
              </Appbar>
          </View>

      </View>
    )
  }

  render() {
    return (
      <View style={{ width, height }}>

        {!this.state.isLoading ? (
          <WallpapersList renderWallpaperListItems={this.renderWallpaperListItems} wallpapers={this.state.wallpapers} isImageFocused={this.state.isImageFocused} />
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
