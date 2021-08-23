import React, { useState, useEffect, useRef } from "react";
import { useIsFocused } from '@react-navigation/native';
import { View, StyleSheet, Text, Image, ActivityIndicator, TouchableHighlight, ScrollView } from "react-native";
import WavyStyle from '../components/WavyStyle';
import profilePic from '../assets/profile.jpg';
import firebase from '../database/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileBtns from '../components/ProfileBtns';
import ReviewItem from '../components/ReviewItem';
import BottomSheet from 'reanimated-bottom-sheet';
import global from '../components/global';

const Profile = ({ navigation, route }) => {
  const [user, setUser] = useState("");
  const [reviews, setReviews] = useState([]);
  const [image, setImage] = useState(null)
  const [isLoaded, setLoaded] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const isFocused = useIsFocused();
  const sheetRef = useRef(null);

  useEffect(() => {
    sheetRef.current.snapTo(1)
    setOpen(false)
    getData();
    if (image == null) {
      setTimeout(() => { setLoaded(true) }, 1000)
    }
  }, [isFocused])

  const singOut = () => {
    //navigation.popToTop()
    firebase.auth().signOut().then(navigation.popToTop())
  }

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

  const handleBS = () => {
    if (!isOpen) sheetRef.current.snapTo(0)
    else sheetRef.current.snapTo(1)
  }

  const renderContent = () => (
    <View style={styles.panel}>
      <TouchableHighlight
        style={styles.panelButton}
        onPress={() => singOut()}
        >
        <Text style={styles.panelButtonTitle}>Editar perfil</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.panelButtonCerrar}
        onPress={() => singOut()}>
        <Text style={styles.panelButtonTitle}>Cerrar sesión</Text>
      </TouchableHighlight>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[155, 0]}
        renderContent={renderContent}
        renderHeader={renderHeader}
        initialSnap={1}
        onOpenEnd={() => setOpen(true)}
        onCloseEnd={() => setOpen(false)}
        enabledContentTapInteraction={false}
      />
      {!isLoaded ?
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={global.PRIMARY_COLOR} />
        </View>
        :
        <View>
          <View style={styles.menu_user}>
            <Text style={styles.user}>@{user.user}</Text>
            {/** route.params?.email == firebase.auth().currentUser.email &&
              <TouchableHighlight onPress={() => handleBS()}>
                <Ionicons name="menu-outline" color="white" style={styles.menu_icon} />
              </TouchableHighlight>
             */}
             <TouchableHighlight onPress={() => handleBS()}>
                <Ionicons name="menu-outline" color="white" style={styles.menu_icon} />
              </TouchableHighlight>
          </View>
          <ScrollView>
            <WavyStyle customStyles={styles.svgCurve} />
            <View style={{ marginTop: 43, alignSelf: 'center' }}>
              {image ?
                <Image source={{ uri: image }} style={styles.profileImg} />
                :
                <Image source={profilePic} style={styles.profileImg} />
              }
            </View>
            {/**route.params?.email != firebase.auth().currentUser.email && <ProfileBtns /> */}
            <View style={styles.reviews_cont}>
              {reviews.map((review, i) => {
                return (
                  <View key={i}>
                    <ReviewItem username={user.user} img={image} review={review} />
                  </View>
                )
              })}
              {reviews.length == 0 &&
                <View style={{ marginTop: 20 }}>
                  <Text>No hay ninguna review publicada todavía.</Text>
                </View>
              }
            </View>
          </ScrollView>
        </View>
      }
    </>
  );
};

const styles = StyleSheet.create({
  menu_user: {
    backgroundColor: global.PRIMARY_COLOR,
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
  svgCurve: {
    position: 'absolute',
    width: '100%',
    top: 0,
  },
  profileImg: {
    borderRadius: 100,
    height: 130,
    width: 130,
  },
  reviews_cont: {
    marginTop: 40,
    width: '100%',
  },
  panel: {
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  panelButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: global.PRIMARY_COLOR,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonCerrar: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: global.PRIMARY_COLOR,
    alignItems: 'center',
    marginTop: 7,
    marginBottom: 20
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
});

export default Profile;