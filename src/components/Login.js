import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    ImageBackground, ActivityIndicator, Image, View, StyleSheet, ScrollView, Text, TextInput,
    TouchableOpacity, Keyboard, Alert
} from 'react-native';

import checkLogin from '../api/checkLogin';
import getToken from '../api/getToken';
import LoginApi from '../api/LoginApi';

class Login extends Component {

    static navigationOptions = {
        title: 'Connexion'
    };

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            pass: '',
            loader: false,
        }
    }

    _validate() {
        const {user, pass} = this.state;

        if (user === '') {
            Alert.alert("Erreur", "Entrez le nom d'utilisateur");
            return false;
        }

        if (pass === '') {
            Alert.alert("Erreur", 'Entrer le mot de passe');
            return false;
        }

        return true
    }

    _onLogin = async () => {

        if (this._validate()) {
            this.setState({loader: true})
            const {navigate} = this.props.navigation;

            const {user, pass} = this.state;

            await LoginApi(user, pass).then((resjson) => {

                if (resjson.status === 'SUCCESS' && this.saveToStorage(resjson.token)) {
                    Alert.alert("succès", resjson.msg);
                    navigate('Events');
                } else if (resjson.status === 'FAIL') {
                    Alert.alert("Erreur", "Nom d'utilisateur ou mot de passe incorrect");
                }

                this.setState({loader: false})
            }).catch((err) => {
                console.log(err);
                this.setState({loader: false})
            });
        }
    }

    async saveToStorage(token) {

        if (token) {

            await AsyncStorage.setItem('@token', token);
            await AsyncStorage.setItem('@isLoggedIn', '1');
            await AsyncStorage.setItem('@url', 'https://creative-ticket.com/');

            return true;
        }

        return false;

    }

    render() {
        const {user, pass} = this.state;

        return (
            <ImageBackground
                style={styles.container}
                resizeMode='cover'
                source={require('../images/concert_1.jpg')}>

                <Image
                    style={styles.stretch}
                    source={{uri: 'https://zupimages.net/up/19/18/3ltf.png'}}
                />

                <View style={styles.islTextPosition}>
                    <Text style={styles.islText}>CREATIVE TICKET</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Utilisateur"
                    autoCapitalize='none'
                    onChangeText={user => this.setState({user})}
                    value={user}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    autoCapitalize='none'
                    onChangeText={pass => this.setState({pass})}
                    value={pass}
                    secureTextEntry
                    keyboardType="default"
                />

                <TouchableOpacity style={styles.btn} onPress={this._onLogin.bind(this)}>
                    {this.state.loader ? <ActivityIndicator size="small" color="#00ff00"/> :
                        <Text style={styles.btn_text}>
                            Se connecter
                        </Text>}
                </TouchableOpacity>

            </ImageBackground>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,

//        backgroundColor: '#c0d6f1'
    },
    input: {
        height: 40,
        width: 250,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: '#000000'
    },
    btn: {
        height: 40,
        width: 120,
        borderRadius: 5,
        backgroundColor: '#ED1C24',
        borderColor: '#e86c60',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn_text: {
        color: 'white',
        fontSize: 12,
        borderRadius: 5,
        fontWeight: "bold",
    },
    islText: {
        color: '#ED1C24',
        fontSize: 16,
        fontWeight: "bold",
    },
    stretch: {
        bottom: 30,
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    islTextPosition: {
        bottom: 20,
        resizeMode: 'contain',
    },
});

export default Login;
