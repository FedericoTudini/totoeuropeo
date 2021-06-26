import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet,ScrollView, Text, View, Dimensions, Image } from 'react-native';
import axios from 'axios';
const finalTable = require('./finalTable')
const result = require('./result')

const vh = Dimensions.get("window").height / 100;
const vw = Dimensions.get("window").width / 100;

export default class Cards extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            names: ["fede", "gaid", "marine", "nicola", "lollo", "marco", "cataldo", "fra", "donghino", "sgaro"]
        }
    }


    createCards = () => {
        console.log(finalTable)
        return this.state.names.map((player) => {
            return <View key={player} style={{backgroundColor: 'white', width: 'auto', padding: 10, borderRadius: 10, margin: 10}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>{player}</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{padding: 5}}>
                        <Text style={styles.title}>Ottavi</Text>
                        {
                            finalTable.finalTable[player].ottavi.map((item, index) =>
                                <View key={item}>
                                    <Text>{finalTable.finalTable[player]["ottavi"][index]}</Text>
                                </View>
                            )
                        }
                    </View>
                    <View style={{padding: 5, justifyContent: 'space-between'}}>
                        <Text style={styles.title}>Quarti</Text>
                        {
                            finalTable.finalTable[player].quarti.map((item, index) =>
                                <View key={item}>
                                    <Text>{finalTable.finalTable[player]["quarti"][index]}</Text>
                                </View>
                            )
                        }
                        <Text style={styles.title}>Semi</Text>
                        {
                            finalTable.finalTable[player].semi.map((item, index) =>
                                <View key={item}>
                                    <Text>{finalTable.finalTable[player]["semi"][index]}</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
                <View >
                    <Text style={styles.title}>Vincente: {finalTable.finalTable[player].prima}</Text>
                    <Text style={styles.title}>Seconda: {finalTable.finalTable[player].seconda}</Text>
                </View>
            </View>
        })
    }

    render () {
        return(
            <ScrollView horizontal={true} style={styles.container}>
                {this.createCards()}
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingLeft: '10%'
    },
    card: {
        height: '90%',
        backgroundColor: 'white'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})