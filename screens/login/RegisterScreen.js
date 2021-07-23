import React, { useState, useEffect, useRef } from "react";
import { Platform, View, StyleSheet, Text, TouchableHighlight, Image } from "react-native";
import { TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '../../database/firebase';
import * as ImagePicker from 'expo-image-picker';
import profilePic from '../../assets/profile.jpg'
import { showMessage } from "react-native-flash-message";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [image, setImage] = useState(null);
  const find = useRef(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  //Abrir cámara y seleccionar imagen
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

  //Subir imagen a firebase
  const uploadImg = async (file, imageName) => {
    const response = await fetch(file);
    const blob = await response.blob();
    return firebase.storage().ref().child(imageName).put(blob);
  }

  //Registrar usuario
  const register = async () => {
    if (!user || !pass || !email) {
      showMessage({
        message: "Error de registro",
        description: "Los campos email, user y password son obligatorios.",
        type: "danger",
      });
    } else {
      await findUser();
      if (find.current == false) {
        firebase.auth().createUserWithEmailAndPassword(email, pass)
          .then(() => {
            if (image) uploadImg(image, user + "_profile");
            firebase.firestore().collection('users').add({user: user, email: email}).then(() => { login() })
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              showMessage({
                message: "Error de registro",
                description: "Ese email ya está en uso.",
                type: "danger",
              });
            } else if (error.code === 'auth/invalid-email') {
              showMessage({
                message: "Error de registro",
                description: "Ese email no tiene un formato correcto.",
                type: "danger",
              });
            } else {
              showMessage({
                message: "Error de registro",
                description: error.message,
                type: "danger",
              });
            }
          });
      } else {
        showMessage({
          message: "Error de registro",
          description: "Nombre de usuario ya en uso.",
          type: "danger",
        });
      }
    }
  }

  //Método para comprobar si ya hay un usuario con el mismo user
  const findUser = async() => {
    find.current = false
    await firebase.firestore().collection("users").where("user", "==", user).limit(1).get().then((value) => {
      if(value.docs[0].data()){
        find.current = true
      }else find.current = false;
    }).catch(() => {find.current = false})
  }

  //Método para iniciar sesión en firebase e ir al Home
  const login = () => {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, pass)
          .then(() => {
            navigation.navigate("Home")
          })
          .catch(error => {
            showMessage({
              message: "Error de registro",
              description: error.message,
              type: "danger",
            });
          });
      })
  }

  return (
    <View style={styles.container}>
      <View style={styles.decoBackground}></View>
      <View style={styles.backButton}>
        <TouchableHighlight onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size="large" color="white" style={{ fontSize: 30 }} />
        </TouchableHighlight>
      </View>
      <View style={styles.regView}>
        <Text style={{ fontSize: 30, color: 'tomato', fontWeight: 'bold', marginTop: 16, marginBottom: 10 }}>REGISTER</Text>
        {image ?
          <TouchableHighlight onPress={pickImage}>
            <Image source={{ uri: image }} style={styles.profileImg} onPress={pickImage} />
          </TouchableHighlight>
          :
          <TouchableHighlight onPress={pickImage}>
            <Image source={profilePic} style={styles.profileImg} />
          </TouchableHighlight>
        }
        <TextInput
          label="Email" value={email} onChangeText={setEmail}
          underlineColor='tomato' outlineColor='tomato'
          theme={{ colors: { text: 'black', primary: 'tomato', background: 'transparent' } }}
          style={{ margin: 10, width: '90%', height: 60, marginBottom: 15 }}
        />
        <TextInput
          label="User" value={user} onChangeText={setUser}
          underlineColor='tomato' outlineColor='tomato'
          theme={{ colors: { text: 'black', primary: 'tomato', background: 'transparent' } }}
          style={{ margin: 10, width: '90%', height: 60, marginBottom: 15 }}
        />
        <TextInput
          label="Password" secureTextEntry value={pass} onChangeText={setPass}
          underlineColor='tomato' outlineColor='tomato'
          theme={{ colors: { text: 'black', primary: 'tomato', background: 'transparent' } }}
          style={{ margin: 10, width: '90%', height: 60, marginBottom: 30 }}
        />
      </View>
      <View style={styles.buttonsView}>
        <TouchableHighlight onPress={() => register()}>
          <View style={styles.regButton}>
            <Text style={styles.textRegButton}>Register</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  decoBackground: {
    backgroundColor: 'tomato',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    textAlign: "center",
    height: '100%',
    width: '100%',
  },
  regView: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 10,
    width: '80%',
    marginTop: 70,
    padding: 10,
  },
  buttonsView: {
    alignItems: 'center',
    marginTop: 20,
  },
  regButton: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 10,
    width: 130,
    height: 34,
  },
  textRegButton: {
    color: 'tomato',
    fontSize: 20,
    fontWeight: 'bold'
  },
  profileImg: {
    borderRadius: 100,
    height: 130,
    width: 130,
  },
});
export default Register;