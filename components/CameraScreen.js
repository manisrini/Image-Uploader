import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  Alert,
  LogBox,
} from "react-native";
import { Camera } from "expo-camera";
import firebase from "../initfirebase";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]); // ignore specific logs
// ignore all logs

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isImage, setIsImage] = useState();
  const [capImage, setCapImage] = useState();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (isImage) {
      const myimage = await isImage.takePictureAsync();
      console.log(myimage.uri);
      setCapImage(myimage.uri);
    }
  };
  //upload image to firebase
  var getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener("load", function () {
      cb(xhr.response);
    });
    xhr.send();
  };

  const uploadImage = async (uri) => {
    getFileBlob(uri, (blob) => {
      firebase
        .storage()
        .ref()
        .child("images/" + Math.floor(Math.random() * 20000) + 10000)
        .put(blob)
        .then(function (snapshot) {
          console.log("Uploaded a blob or file!");
        });
    });
  };

  const returnToHome = (uri) => {
    uploadImage(uri)
      .then(() => {
        Alert.alert("success");
        navigation.navigate("Home");
      })
      .catch((error) => {
        Alert.alert("errorr");
        return;
      });
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          setIsImage(ref);
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
          <View style={styles.btn}>
            <Button title="take a pic" onPress={takePicture} />
          </View>
        </View>
      </Camera>
      {capImage && <Image style={styles.cap} source={{ uri: capImage }} />}
      {capImage && (
        <Button title="Confirm" onPress={() => returnToHome(capImage)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  camera: {
    height: 300,
    marginBottom: 20,
  },

  text: {
    fontSize: 30,
    fontWeight: "bold",
  },

  btn: {
    display: "flex",
    alignItems: "baseline",
  },
  cap: {
    display: "flex",
    flex: 1,
    height: 100,
  },
});

export default CameraScreen;
