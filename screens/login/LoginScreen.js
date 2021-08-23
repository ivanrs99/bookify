import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import { TextInput } from 'react-native-paper';
import AppLoading from 'expo-app-loading';
import firebase from '../../database/firebase'
import { showMessage } from "react-native-flash-message";
import * as Animatable from 'react-native-animatable';
import global from '../../components/global';
import { Dimensions } from 'react-native';

const vW = Dimensions.get('window').width;

const Login = ({ navigation }) => {
    const [isReady, setReady] = useState(false);
    const [pass, setPass] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                navigation.navigate("Home")
            }
            setReady(true)
        });
    }, [])

    const login = () => {
        if (!user || !pass) {
            showMessage({
                message: "Error de inicio de sesión",
                description: "Debes de completar el usuario y la contraseña",
                type: "danger",
            });
        } else {
            let email = "";
            firebase.firestore().collection("users").where("user", "==", user).limit(1).get()
                .then((value) => {
                    email = value.docs[0].data().email;
                    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                        .then(() => {
                            return firebase.auth().signInWithEmailAndPassword(email, pass)
                                .then(() => {
                                    navigation.navigate("Home")
                                })
                                .catch(() => {
                                    showMessage({
                                        message: "Error de inicio de sesión",
                                        description: "La contraseña no es correcta.",
                                        type: "danger",
                                    });
                                });
                        })
                })
                .catch(() => {
                    showMessage({
                        message: "Error de inicio de sesión",
                        description: "No hay ningún usuario con ese nombre o contraseña.",
                        type: "danger",
                    });
                });
        }
    }

    return (
        <>
            {!isReady ?
                <View>
                    <AppLoading />
                </View>
                :
                <View style={styles.container}>
                    <View style={styles.welcomeView}>
                        <Text style={{ color: 'white', fontSize: 24 }}>Welcome to</Text>
                        <Text style={{ color: 'white', fontSize: 36, fontWeight: 'bold', letterSpacing: 10 }}>Bookify!</Text>
                    </View>
                    <Animatable.View style={styles.logView} animation="fadeInUpBig">
                        <TextInput
                            label="User" value={user} onChangeText={setUser}
                            underlineColor={global.PRIMARY_COLOR} outlineColor={global.PRIMARY_COLOR}
                            theme={{ colors: { text: 'black', primary: global.PRIMARY_COLOR, background: 'transparent' } }}
                            style={{ marginVertical: 10, width: '90%', height: 60, marginBottom: 15 }}
                        />
                        <TextInput
                            label="Password" secureTextEntry value={pass} onChangeText={setPass}
                            underlineColor={global.PRIMARY_COLOR} outlineColor={global.PRIMARY_COLOR}
                            theme={{ colors: { text: 'black', primary: global.PRIMARY_COLOR, background: 'transparent' } }}
                            style={{ marginVertical: 10, width: '90%', height: 60, marginBottom: 50 }}
                        />
                        <TouchableHighlight onPress={() => login()}>
                            <View style={styles.logButton}>
                                <Text style={styles.textLogButton}>Sign in</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => navigation.navigate("Register")}>
                            <View>
                                <Text style={{ color: global.PRIMARY_COLOR, fontSize: 18, textDecorationLine: 'underline' }}>Sign up</Text>
                            </View>
                        </TouchableHighlight>
                    </Animatable.View>
                </View>}
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: global.PRIMARY_COLOR,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        textAlign: "center",
        height: '100%',
        width: '100%',
    },
    welcomeView: {
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logView: {
        backgroundColor: '#fff',
        alignItems: 'center',
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        width: '100%',
        flexGrow: 1,
    },
    logButton: {
        backgroundColor: global.PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderRadius: 10,
        height: 37,
        width: vW-30,
    },
    textLogButton: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
});

export default Login;