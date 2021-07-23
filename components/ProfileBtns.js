import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import firebase from '../database/firebase'
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileBtns = () => {
    const singOut = () => {
        firebase.auth().signOut()
        console.log("Sesion cerrada")
    }

    return (
        <View style={styles.btns}>
            <TouchableHighlight onPress={() => singOut()}>
                <View style={[styles.btn, styles.btnContact]}>
                    <View style={styles.divIcon}>
                        <Ionicons name="mail-outline" color="#ec8f6a" style={{ fontSize: 16 }} />
                    </View>
                    <View style={styles.txt}>
                        <Text style={{ color: '#fff' }}>Contact</Text>
                    </View>
                </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => singOut()}>
                <View style={[styles.btn, styles.btnChat]}>
                    <View style={styles.divIcon}>
                        <Ionicons name="paper-plane-outline" color="#e2c275" style={{ fontSize: 16 }} />
                    </View>
                    <View style={styles.txt}>
                        <Text style={{ color: '#fff' }}>Chat</Text>
                    </View>
                </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => singOut()}>
                <View style={[styles.btn, styles.btnFollow]}>
                    <View style={styles.divIcon}>
                        <Ionicons name="person-add-outline" color="#8bbabb" style={{ fontSize: 16 }} />
                    </View>
                    <View style={styles.txt}>
                        <Text style={{ color: '#fff' }}>Follow</Text>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    btns: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 40,
    },
    btn: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        height: 40,
        width: 100,
        margin: 10,
    },
    divIcon: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: 30,
    },
    btnFollow: {
        backgroundColor: '#8bbabb',
        borderColor: '#8bbabb',
    },
    btnChat: {
        backgroundColor: '#e2c275',
        borderColor: '#e2c275',
    },
    btnContact: {
        backgroundColor: '#ec8f6a',
        borderColor: '#ec8f6a',
    },
    txt: {
        flexGrow: 1,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center'
    },
});

export default ProfileBtns;