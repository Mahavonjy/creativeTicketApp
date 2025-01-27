import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
    ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//import { Icon } from 'react-native-elements';


import getToken from '../api/getToken';
import ScanBarcode from './ScanBarcode';
import EventsApi from '../api/EventsApi';


class Events extends Component {

    static navigationOptions = {
        title: 'Mes événements      '
    };

    constructor(props) {

        super(props);

        this.state = {data: []};

    }

    componentDidMount() {
        getToken().then(token => EventsApi(token)).then((data) => {
            this.setState({data: (data.status === 'SUCCESS') ? data.events : ''})
        }).catch(err => console.log(err));
    }

    async logout() {
        await AsyncStorage.setItem('@token', '');
        await AsyncStorage.setItem('@isLoggedIn', '0');
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <ImageBackground
                style={styles.container}
                resizeMode='cover'
                source={require('../images/event-bg-4.jpg')}>


                <View style={styles.heading}>
                    <TouchableOpacity style={styles.button} onPress={() => this.logout()}>
                        <Text>Déconnexion</Text>
                    </TouchableOpacity>
                </View>

                {this.state.data.length ?
                    <FlatList
                        data={this.state.data}
                        renderItem={({item, index}) =>
                            <View style={{
                                flex: 1,
                                backgroundColor: index % 2 === 0 ? '#eee' : '#fcfcfc',
                                padding: 5
                            }}>

                                <TouchableWithoutFeedback
                                    onPress={() => this.props.navigation.navigate('ListTickets', {
                                        eid: parseInt(item.ID),
                                        title: item.post_title,
                                        description: item.post_content
                                    })}
                                >
                                    <View style={styles.item}>
                                        <Text style={styles.itemindex}>{index + 1}</Text>
                                        <Text style={styles.itemtext}>{item.post_title}</Text>
                                        <Text style={
                                            item.comment_status === "open" ? styles.itemtextOpen : styles.itemtextClosed
                                        }>
                                            {item.comment_status === "open" ? "ouvert actuellement" : "fermé"}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>

                            </View>
                        }
                        keyExtractor={item => item.post_title}

                    /> :
                    <View style={{
                        backgroundColor: '#fcfcfc',
                        padding: 5,
                        height: 50,
                        alignItems: "center"
                    }}>
                        <View style={styles.item}>
                            <Text style={styles.itemtext}>Il n'y a pas d'événement</Text>
                        </View>

                    </View>
                }

            </ImageBackground>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    button: {
        alignSelf: 'flex-end',
        backgroundColor: "#DDDDDD",
        padding: 10,
        borderRadius: 5
    },
    item: {
        fontSize: 16,
        padding: 10,
        flex: 1,
        flexDirection: 'row'
    },
    itemtext: {
        fontWeight: 'bold',
    },
    itemtextOpen: {
        color: "green",
        marginLeft: 20
    },
    itemtextClosed: {
        color: "red",
        marginLeft: 20
    },

    itemindex: {
        color: '#000',
        marginRight: 15,
        fontWeight: 'bold',
    },

    heading: {
        // justifyContent: 'space-between',
        // flexDirection: 'row',
        backgroundColor: '#58585a',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 30,
        padding: 5

    }
});


export default Events;
