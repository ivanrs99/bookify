import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native';
import { View, StyleSheet, TouchableHighlight, Text, TextInput } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input } from 'react-native-elements';
import { Rating } from 'react-native-elements';
import firebase from '../database/firebase';
import { showMessage } from "react-native-flash-message";

const ReviewForm = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [stars, setStars] = useState(0)
  const [review, setReview] = useState("")

  useEffect(() => {
    clearValues();
  }, [isFocused]);

  const clearValues = () => {
    setTitle("")
    setAuthor("")
    setStars(0)
    setReview("")
  }

  //Guardar review en firebase
  const saveReview =  () => {
    const email = firebase.auth().currentUser.email;
    firebase.firestore().collection("users").where("email", "==", email).limit(1).get()
      .then(async (value) => {
        await firebase.firestore().collection("users").doc(value.docs[0].id)
          .collection("reviews").add({ title, author, stars, review, created: firebase.firestore.FieldValue.serverTimestamp() })
        showMessage({
          message: "PERFECTO!",
          description: "Review guardada con éxito!",
          type: "success",
        });
        navigation.goBack();
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <TouchableHighlight onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size="large" color="white" style={{ fontSize: 30 }} />
        </TouchableHighlight>
      </View>
      <View style={styles.card}>
        <Input placeholder='Title' onChangeText={setTitle} value={title}/>
        <Input placeholder='Author' onChangeText={setAuthor} value={author}/>
        <View style={styles.score}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15 }}>Stars: </Text>
          <Rating imageSize={30} onFinishRating={setStars} startingValue={stars} />
        </View>
        <TextInput
          style={styles.input}
          onChangeText={setReview}
          value={review}
          placeholder="Text your review"
          multiline={true}
        />
        <View style={styles.viewBtn}>
          <TouchableHighlight onPress={() => saveReview()}>
            <View style={styles.saveBtn}>
              <Text style={styles.textBtn}>Save</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'tomato',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: '100%',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    padding: 10,
  },
  score: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  input: {
    borderWidth: 0.3,
    height: 60,
    margin: 10,
    padding: 5,
    marginTop: 18,
  },
  viewBtn: {
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  saveBtn: {
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: 10,
    width: 120,
    height: 30,
  },
  textBtn: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewForm;