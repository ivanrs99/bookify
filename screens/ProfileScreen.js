import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, ActivityIndicator, TouchableHighlight, ScrollView } from "react-native";
import WavyStyle from '../components/WavyStyle'
import profilePic from '../assets/profile.jpg'
import firebase from '../database/firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileBtns from '../components/ProfileBtns'
import ReviewItem from '../components/ReviewItem'

const Profile = ({ navigation, route }) => {
  const [user, setUser] = useState("");
  const [reviews, setReviews] = useState([]);
  const [image, setImage] = useState(null)
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    getData();
    setTimeout(() => { setLoaded(true) }, 1000)
  }, [])

  //Cerrar sesión
  const singOut = () => {
    firebase.auth().signOut()
    navigation.popToTop()
  }

  //Obtener usuario y sus reviews
  const getData = async () => {
    const email = route.params?.email;
    await firebase.firestore().collection("users").where("email", "==", email).limit(1).get()
      .then((value) => {
        setUser(value.docs[0].data());
        getImage(value.docs[0].data().user)
        firebase.firestore().collection("users").doc(value.docs[0].id).collection("reviews").orderBy("created", "desc").onSnapshot((snapshotChange) => {
          const list = [];
          snapshotChange.forEach((doc) => {
            list.push({
              id: doc.id,
              ...doc.data()
            })
          })
          setReviews(list)
        })
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  const getImage = async (username) => {
    const ref = firebase.storage().ref(username + '_profile');
    const url = await ref.getDownloadURL();
    setImage(url)
  }

  return (
    <>
      {!isLoaded ?
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="tomato" />
        </View>
        :
        <View>
          <View style={styles.menu_user}>
            <Text style={styles.user}>@{user.user}</Text>
            {route.params?.email == firebase.auth().currentUser.email &&
              <TouchableHighlight onPress={() => singOut()}>
                <Ionicons name="menu-outline" color="white" style={styles.menu_icon} />
              </TouchableHighlight>
            }
          </View>
          <ScrollView>
            <View style={styles.container}>
              <WavyStyle customStyles={styles.svgCurve} />
              <View style={{ marginTop: 43 }}>
                {image ?
                  <Image source={{ uri: image }} style={styles.profileImg} />
                  :
                  <Image source={profilePic} style={styles.profileImg} />
                }
              </View>
              {route.params?.email != firebase.auth().currentUser.email && <ProfileBtns />}
              <View style={styles.reviews_cont}>
                {reviews.map((review, i) => {
                  return (
                    <View key={i}>
                      <ReviewItem username={user.user} img={image} review={review} />
                    </View>
                  )
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
  },
  svgCurve: {
    position: 'absolute',
    width: '100%',
    top: 0,
    zIndex: 0,
  },
  profileImg: {
    borderRadius: 100,
    height: 130,
    width: 130,
    zIndex: 9,
  },
  menu_user: {
    backgroundColor: 'tomato',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 40,
    zIndex: 999,
  },
  user: {
    color: 'white',
    flexGrow: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  menu_icon: {
    flex: 0,
    fontSize: 33,
    marginRight: 10,
  },
  reviews_cont: {
    marginTop: 40,
    width: '100%',
  }
});

export default Profile;