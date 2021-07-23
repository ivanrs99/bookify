import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableHighlight, ActivityIndicator, Image, ScrollView } from "react-native";
//import { useFonts, Oswald_700Bold } from '@expo-google-fonts/oswald'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '../database/firebase'
import badface from '../assets/images/badface.png'
import ReviewItem from '../components/ReviewItem'

const Home = ({ navigation }) => {
  const [isLoaded, setLoaded] = useState(false)
  const [data, setData] = useState([])
  const [isFinished, setFinished] = useState(false)
  const counter = useRef(1)

  useEffect(() => {
    getData();
    setTimeout(() => { setLoaded(true) }, 1000)
  }, [])

  //Obtener las reviews de 6 en 6 en función del contador
  const getData = () => {
    const email = firebase.auth().currentUser.email;
    firebase.firestore().collection("users").where("email", "==", email).limit(1).get()
      .then(async(value) => {
        const user = value.docs[0].data().user;
        const ref = firebase.storage().ref(user + '_profile');
        const url = await ref.getDownloadURL();
        firebase.firestore().collection("users").doc(value.docs[0].id).collection("reviews").orderBy("created", "desc").onSnapshot((snapshotChange) => {
          const list = [];
          snapshotChange.forEach((doc) => {
            list.push({
              id: doc.id,
              user: user,
              img: url,
              ...doc.data(),
            })
          })
          if (data.length + 2 >= list.length) setFinished(!isFinished)
          setData(list.slice(0, counter.current * 6))
        })
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  //Actualizar el contador y llamar a getData
  const actData = () => {
    counter.current = counter.current + 1;
    getData()
  }

  return (
    <View style={styles.center}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookify!</Text>
        <TouchableHighlight onPress={() => navigation.push("ReviewForm")}>
          <View>
            <Ionicons name="add-circle-outline" color="white" style={{ fontSize: 35, marginRight: 10, marginTop: 8 }} />
          </View>
        </TouchableHighlight>
      </View>
      {!isLoaded ?
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="tomato" />
        </View>
        :
        <>
          {data.length > 0 ?
            <ScrollView style={{ width: '100%' }}>
              {data.map((review, i) => {
                return (
                  <View key={i}>
                    <ReviewItem username={review.user} img={review.img} review={review} />
                  </View>
                )
              })}
              {!isFinished &&
                <TouchableHighlight onPress={() => actData()}>
                  <View style={styles.seeBtn}>
                    <Text style={styles.seeTxt}>See more!</Text>
                  </View>
                </TouchableHighlight>
              }
            </ScrollView>
            :
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={badface} style={{ width: 200, height: 80, resizeMode: 'contain', marginBottom: 5 }} />
              <Text>No hay ninguna review publicada todavía.</Text>
            </View>
          }
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
  },
  header: {
    backgroundColor: 'tomato',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    height: 50,
  },
  title: {
    color: 'white',
    fontSize: 25,
    marginTop: 6,
    marginLeft: 10,
  },
  seeBtn: {
    alignItems: 'center',
    marginVertical: 15,
  },
  seeTxt: {
    color: 'tomato',
    fontSize: 20,
    textDecorationLine: 'underline'
  }
});

export default Home;