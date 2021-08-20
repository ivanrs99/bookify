import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import { TextInput } from 'react-native-paper';
import AppLoading from 'expo-app-loading';
import firebase from '../../database/firebase'
import { showMessage } from "react-native-flash-message";
import * as Animatable from 'react-native-animatable';

const Login = ({ navigation }) => {
    const [isReady, setReady] = useState(false);
    const [pass, setPass] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                //console.log(firebase.auth().currentUser)
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
                    <View style={styles.decoBackgroundTop}></View>
                    <View style={styles.decoBackgroundBottom}></View>
                    <Animatable.View style={styles.logView} animation="fadeInUpBig">
                        <Text style={{ fontSize: 30, color: 'tomato', fontWeight: 'bold', marginTop: 16, marginBottom: 10 }}>LOGIN</Text>
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
                    </Animatable.View>
                    <Animatable.View style={styles.buttonsView} animation="fadeInUpBig">
                        <TouchableHighlight onPress={() => login()}>
                            <View style={styles.logButton}>
                                <Text style={styles.textLogButton}>Login</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => navigation.navigate("Register")}>
                            <View>
                                <Text style={{ color: 'tomato', fontSize: 18, textDecorationLine: 'underline' }}>Register</Text>
                            </View>
                        </TouchableHighlight>
                    </Animatable.View>
                </View>}
        </>
    );
};
const styles = StyleSheet.create({
    decoBackgroundTop: {
        backgroundColor: 'tomato',
        position: 'absolute',
        width: '100%',
        height: '15%',
        top: 0,
    },
    decoBackgroundBottom: {
        backgroundColor: 'tomato',
        position: 'absolute',
        width: '100%',
        height: '15%',
        bottom: 0,
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
    logView: {
        backgroundColor: '#fff',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
        borderWidth: 1,
        width: '80%',
        marginTop: 75,
        padding: 10,
    },
    buttonsView: {
        alignItems: 'center',
        marginTop: 20,
    },
    logButton: {
        backgroundColor: 'tomato',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginBottom: 10,
        width: 130,
        height: 34,
    },
    textLogButton: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
});

export default Login;