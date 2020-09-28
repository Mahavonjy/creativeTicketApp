import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    ImageBackground, ActivityIndicator, Image, View, StyleSheet, ScrollView, Text, TextInput,
    TouchableOpacity, Keyboard, Alert
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
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
            secure_pass: true,
            loader: false,
            isRemember: false,
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

            if (this.state.isRemember) {
                await AsyncStorage.setItem('@user', user);
                await AsyncStorage.setItem('@pass', pass);
            } else {
                await AsyncStorage.setItem('@user', '');
                await AsyncStorage.setItem('@pass', '');
            }

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

    checkUserLog = async () => {
        let user = await AsyncStorage.getItem('@user')
        let pass = await AsyncStorage.getItem('@pass')
        if (user && pass)
            this.setState({isRemember: true})
        this.setState({user: user, pass: pass})
    }

    componentDidMount() {
        this.checkUserLog().then(r => null)
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
                    source={require('../images/ISL_logo.png')}
                />

                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.input}
                        placeholder="Utilisateur"
                        autoCapitalize='none'
                        onChangeText={user => this.setState({user})}
                        value={user}
                    />
                    <Image source={require('../images/user.png')}
                           style={styles.iconUser}/>
                </View>

                <View style={styles.SectionStyle}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        autoCapitalize='none'
                        onChangeText={pass => this.setState({pass})}
                        value={pass}
                        secureTextEntry={this.state.secure_pass}
                        keyboardType="default"
                    />
                    {this.state.secure_pass ?
                        <TouchableOpacity onPress={() => this.setState({secure_pass: false})}>
                            <Image
                                source={require('../images/blind-symbol-of-an-opened-eye-with-a-slash.png')}
                                style={styles.IconStyle}/>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => this.setState({secure_pass: true})}>
                            <Image
                                source={require('../images/eye.png')}
                                style={styles.IconStyle}/>
                        </TouchableOpacity>}
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10, backgroundColor: 'white', borderRadius: 2}}>
                    <CheckBox
                        tintColor={this.state.isRemember ? 'green' : 'black'}
                        onValueChange={() => this.setState({isRemember: !this.state.isRemember})}
                        style={{width: 18, height: 18, margin: 5, padding: 5}}
                        value={this.state.isRemember}
                    />
                    <Text style={{color: 'black', margin: 5}}>Se souvenir de moi</Text>
                </View>
                <TouchableOpacity style={styles.btn} onPress={this._onLogin.bind(this)}>
                    {this.state.loader ? <ActivityIndicator size="small" color="#00ff00"/> :
                        <Text style={styles.btn_text}>
                            Se Connecter
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
    },
    SectionStyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 40,
        borderRadius: 5,
        width: 250,
        marginBottom: 15,
    },
    IconStyle: {
        padding: 10,
        margin: 8,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        alignItems: 'center'
    },
    iconUser: {
        padding: 10,
        margin: 8,
        height: 23,
        width: 23,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingLeft: 10
    },
    btn: {
        height: 40,
        width: 120,
        borderRadius: 5,
        backgroundColor: '#E86C60',
        borderColor: '#e86c60',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn_text: {
        color: 'white',
        fontSize: 12,
    },
    stretch: {
        bottom: 10,
        width: 250,
        height: 250,
        resizeMode: 'contain',
    }
});

export default Login;
