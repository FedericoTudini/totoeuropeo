import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import axios from 'axios';
const players = require('./players');

const vh = Dimensions.get("window").height / 100;
const vw = Dimensions.get("window").width / 100;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endLoading: false,
      data: {},
      "fede": 0,
      "gaid" : 0
    }
  }

  loadData = async () => {
    await axios.get('https://totoeuro-api.herokuapp.com/matches')
    .then((response) => {
      this.setState({ data : response.data});
      console.log(this.state.data);
      console.log(players);
    })
    .catch((err) => {
        console.log(err);
    }) 
  }

  calcColor = (match, player, matchString) => {
    var home = match.score.homeTeam;
    var away = match.score.awayTeam;
    var homeGuess = players.players[player][matchString].home;
    var awayGuess = players.players[player][matchString].away;
    if (match.status === "SCHEDULED")
      return "#212121"
    if (home === homeGuess && away === awayGuess) {
      return "#3b570f"
    }
    if ((home-away > 0 && homeGuess-awayGuess > 0) || (home-away === 0 && homeGuess-awayGuess === 0) || (home-away < 0 && homeGuess-awayGuess < 0))
    {
      return "#0000ff"
    }
    return "#ff0000"
  }

  async componentDidMount() {
    await this.loadData();
    this.setState({endLoading: true});
  }

  renderMatches = () => {
    return this.state.data.matches.filter((match) => 
    {
      return match.stage === "GROUP_STAGE"; 
    }).map((match) => 
    {
      var temp = match.homeTeam.name + "-" + match.awayTeam.name
      var matchString = temp.replace(/\s/g, '')
      console.log(matchString)
      console.log(players)
      return (
        <View key={match.homeTeam.name + " " + match.awayTeam.name} style={styles.matchBox}>
          <View>
            <Text>{match.status}</Text>
          </View>
          <View>
            <Text numberOfLines={1} style={{
              fontSize: 6*vw
            }}>{match.homeTeam.name} - {match.awayTeam.name}</Text>
          </View>
          <View>
            {match.score.homeTeam != null ? 
              <Text style={styles.result}>{match.score.homeTeam + " - " +  match.score.awayTeam}</Text> :
              <Text style={styles.result}>0 - 0</Text>
            }
          </View>
          <Text style={{fontSize: 5*vw}}>Pronostici</Text>
          <View style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
              backgroundColor: this.calcColor(match, "fede", matchString),
              width: "90%",
              borderRadius: 20
            }}>
              <Text style={{
                fontSize: 4.5*vw,
                color: 'white'
              }}>Fede: {players.players.fede[matchString].home + "-" + players.players.fede[matchString].away}</Text>
            </View>
            <View style={{
              backgroundColor: this.calcColor(match, "gaid", matchString),
              width: "90%",
              borderRadius: 20,
              margin: 4
            }}>
              <Text style={{
                fontSize: 4.5*vw,
                color: 'white'
              }}>Gaid {players.players.gaid[matchString].home + "-" + players.players.gaid[matchString].away}</Text>
            </View>
          </View>
        </View>
      )
    })
  }

  render() {
    if (!this.state.endLoading)
    {
      return (
        <View style={{
          flex:1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'orange'
        }}></View>
      )
    }
    else
    {
      return (
        <View style={styles.container}>
          <View style={styles.topbar}>
            <Text style={{
              fontSize: 6.5*vw,
              fontWeight: '900',
              fontStyle: 'italic'
            }}>TotoApp</Text>
          </View>
          {this.renderMatches()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
  },
  topbar: {
    height: 10*vh,
    width: 100*vw,
    backgroundColor: "#fff",
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  matchBox: {
    width: 80*vw,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    margin: 15,
    justifyContent: 'flex-start',
    borderRadius: 5,
    justifyContent: 'center',
    textAlign: 'center'
  },
  result: {
    fontSize: 7*vw,
    fontWeight: 'bold'
  },
});
