import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Text, Button, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


class ListTickets extends Component {

    static navigationOptions = {
        title: 'Check-in',
    };

    constructor(props) {
        super(props);
        this.state = {
            eid: [],
            description: ""
        };

    }

    componentDidMount() {

        const {navigation} = this.props;
        this.setState({eid: parseInt(JSON.stringify(navigation.getParam('eid', 0)))})
        if (this.props.navigation.getParam('description')) {
            this.setState({
                description: this.props.navigation.getParam('description')
                    .replace("<p>", "")
                    .replace("</p>", "")
            })
        }

    }

    async logout() {

        await AsyncStorage.setItem('@token', '');
        await AsyncStorage.setItem('@isLoggedIn', '0');
        this.props.navigation.navigate('Login');
    }

    render() {

        return (

            <View style={styles.container}>

                <View style={styles.heading}>
                    <Text style={styles.heading}>{this.props.navigation.getParam('title')}</Text>
                    <Text style={styles.headingT}>Description</Text>
                    <Text style={styles.headingS}>{this.state.description}</Text>
                </View>
                <View style={styles.scan}>
                    <Button
                        title="Scan QR Code"
                        onPress={() => this.props.navigation.navigate('ScanBarcode', {eid: this.state.eid})}/>
                </View>
            </View>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    item: {
        padding: 10,
        fontSize: 18,

        borderTopWidth: 1,
        borderBottomColor: '#000000',
        height: 44,
    },
    heading: {
        textAlign: "center",
        flexDirection: 'column',
        backgroundColor: '#58585a',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 6.5

    },
    headingT: {
        textAlign: "center",
        flexDirection: 'column',
        backgroundColor: '#58585a',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        padding: 6.5

    },
    headingS: {
        textAlign: "center",
        flexDirection: 'column',
        backgroundColor: '#58585a',
        color: '#fff',
        marginLeft: 15,
        marginRight: 15,
        fontWeight: 'bold',
        fontSize: 12,
        padding: 6.5

    },
    scan: {
        marginTop: 100
    }
});


export default ListTickets;
