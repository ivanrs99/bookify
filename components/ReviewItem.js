import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import profilePic from '../assets/profile.jpg'
import { Rating } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReviewItem = (props) => {

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.header_review}>
                    {props.img ?
                        <Image source={{ uri: props.img }} style={styles.profileImg} />
                        :
                        <Image source={profilePic} style={styles.profileImg} />
                    }
                    <View style={styles.data_cont}>
                        <View style={styles.header_data}>
                            <Text style={styles.title}>@{props.username}</Text>
                            <Ionicons name="ellipsis-horizontal" color="black" style={styles.menu_icon} />
                        </View>
                    </View>
                </View>
                <View style={styles.body_review}>
                    <View style={styles.header_data}>
                        <Text style={styles.subtitle}>{props.review.title} - {props.review.author}</Text>
                        <Rating type="custom" tintColor="white"
                            ratingBackgroundColor="transparent" imageSize={15}
                            readonly startingValue={props.review.stars}
                        />
                    </View>
                    <Text style={{ marginLeft: 7 }} numberOfLines={3}>{props.review.review}</Text>
                </View>
            </View>
            <View style={{ height: 1, width: '100%', borderColor: 'black', borderWidth: 0.2 }}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        marginVertical: 8,
        width: '100%',
    },
    header_review: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    body_review: {
        display: 'flex',
    },
    profileImg: {
        borderRadius: 100,
        height: 50,
        width: 50,
        margin: 10
    },
    data_cont: {
        flexGrow: 1,
    },
    header_data: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
    },
    title: {
        flexGrow: 1,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        flexGrow: 1,
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    menu_icon: {
        fontSize: 30,
    },
});

export default ReviewItem;