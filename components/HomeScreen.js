import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  Text,
  Button,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "../initfirebase";

const HomeScreen = ({ navigation }) => {
  const [takePic, setTakePic] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const onTakePicture = () => {
    navigation.navigate("Camera");
  };

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
        .child("images/" + Math.floor(Math.random() * 10000) + 1)
        .put(blob)
        .then(function (snapshot) {
          console.log("Uploaded a file!");
        });
    });
  };

  const returnToHome = (uri) => {
    uploadImage(uri)
      .then(() => {
        setImage(null);
        Alert.alert("success");
        navigation.navigate("Home");
      })
      .catch((error) => {
        Alert.alert("errorr");
        return;
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Image Picker</Text>

      <View style={styles.btn}>
        <Button title="Pick an image " color="blue" onPress={pickImage} />
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}

        {image && <Button title="upload" onPress={() => returnToHome(image)} />}
      </View>
      <View>
        <Button
          onPress={onTakePicture}
          title="Take picture"
          color="dodgerblue"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    fontSize: 40,
  },

  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  btn: {
    margin: 15,
  },
});

export default HomeScreen;
