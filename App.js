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
      fede: 0,
      gaid: 0
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
      return "#121212"
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
    //this.calcPoints()
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
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <View style={{flex:1, alignItems: 'center'}}>
              <View style={{
                backgroundColor: this.calcColor(match, "fede", matchString),
                width: "90%",
                borderRadius: 20,
                margin: 3
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
                margin: 3
              }}>
                <Text style={{
                  fontSize: 4.5*vw,
                  color: 'white'
                }}>Gaid: {players.players.gaid[matchString].home + "-" + players.players.gaid[matchString].away}</Text>
              </View>
              <View style={{
                backgroundColor: this.calcColor(match, "cataldo", matchString),
                width: "90%",
                borderRadius: 20,
                margin: 3
              }}>
                <Text style={{
                  fontSize: 4.5*vw,
                  color: 'white'
                }}>Cataldo: {players.players.cataldo[matchString].home + "-" + players.players.cataldo[matchString].away}</Text>
              </View>
              <View style={{
                backgroundColor: this.calcColor(match, "lollo", matchString),
                width: "90%",
                borderRadius: 20,
                margin: 3
              }}>
                <Text style={{
                  fontSize: 4.5*vw,
                  color: 'white'
                }}>Lollo: {players.players.lollo[matchString].home + "-" + players.players.lollo[matchString].away}</Text>
              </View>
              <View style={{
                backgroundColor: this.calcColor(match, "marine", matchString),
                width: "90%",
                borderRadius: 20,
                margin: 3
              }}>
                <Text style={{
                  fontSize: 4.5*vw,
                  color: 'white'
                }}>Marine: {players.players.marine[matchString].home + "-" + players.players.marine[matchString].away}</Text>
              </View>
            </View>
            <View style={{flex:1, alignItems: 'center'}}>
              <View style={{
                backgroundColor: this.calcColor(match, "nicola", matchString),
                width: "90%",
                borderRadius: 20,
                margin: 3
              }}>
                <Text style={{
                  fontSize: 4.5*vw,
                  color: 'white'
                }}>Nicola: {players.players.nicola[matchString].home + "-" + players.players.nicola[matchString].away}</Text>
              </View>
              <View style={{
                backgroundColor: this.calcColor(match, "fra", matchString),
                width: "90%",
                borderRadius: 20,
                margin: 3
              }}>
                <Text style={{
                  fontSize: 4.5*vw,
                  color: 'white'
                }}>Fra: {players.players.fra[matchString].home + "-" + players.players.fra[matchString].away}</Text>
              </View>
              <View style={{
                backgroundColor: this.calcColor(match, "marco", matchString),
                width: "90%",
                borderRadius: 20,
                margin: 3
              }}>
                <Text style={{
                  fontSize: 4.5*vw,
                  color: 'white'
                }}>Maerco: {players.players.marco[matchString].home + "-" + players.players.marco[matchString].away}</Text>
              </View>
              <View style={{
              backgroundColor: this.calcColor(match, "donghino", matchString),
              width: "90%",
              borderRadius: 20,
              margin: 3
            }}>
              <Text style={{
                fontSize: 4.5*vw,
                color: 'white'
              }}>Dongue: {players.players.donghino[matchString].home + "-" + players.players.donghino[matchString].away}</Text>
            </View>
            </View>
          </View>
        </View>
      )
    })
  }

  calcPoints = () => {
    this.state.data.matches.filter((match) => 
    {
      return match.stage === "GROUP_STAGE"; 
    }).map((match) => {
      for (var key in players) {
        var temp = match.homeTeam.name + "-" + match.awayTeam.name
        var matchString = temp.replace(/\s/g, '')
        var home = match.score.homeTeam;
        var away = match.score.awayTeam;
        var homeGuess = players.players[matchString].home; // TODO: fix undefined on home
        var awayGuess = players.players[matchString].away;
        if (home === homeGuess && away === awayGuess) {
          var tmp = this.state[key]
          this.setState({key: tmp})
        }
        if ((home-away > 0 && homeGuess-awayGuess > 0) || (home-away === 0 && homeGuess-awayGuess === 0) || (home-away < 0 && homeGuess-awayGuess < 0))
          var tmp = this.state[key]
          this.setState({key: tmp})
      }
    })
    console.log(this.state)
  }

  /*
      var matchString = temp.replace(/\s/g, '')
      var home = match.score.homeTeam;
      var away = match.score.awayTeam;
      var homeGuess = plr[matchString].home;
      var awayGuess = plr[matchString].away;
      if (match.status === "SCHEDULED")
      console.log("Da Giocare")
      if (home === homeGuess && away === awayGuess) {
        console.log("Risultato esatto")
      }
      if ((home-away > 0 && homeGuess-awayGuess > 0) || (home-away === 0 && homeGuess-awayGuess === 0) || (home-away < 0 && homeGuess-awayGuess < 0))
      {
        console.log("Pronostico preso")
      }
      console.log("Nessun punto")
      } */

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
