import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import axios from 'axios';
const players = require('./players');
const finalTable = require('./finalTable')
const result = require('./result')
import Cards from './cards'

const vh = Dimensions.get("window").height / 100;
const vw = Dimensions.get("window").width / 100;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endLoading: false,
      data: {},
      names: ["fede", "gaid", "marine", "nicola", "lollo", "marco", "cataldo", "fra", "donghino"]
    }
  }

  loadData = async () => {
    await axios.get('https://blooming-lowlands-15801.herokuapp.com/matches')
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
    console.log(this.state)
  }

  renderTable = () => {
    var listPlayers= [
      {"fede": 0},
      {"gaid":0},
      {"cataldo":0},
      {"nicola":0},
      {"lollo":0},
      {"marine":0},
      {"donghino":0},
      {"marco":0},
      {"sgaro":0},
      {"fra":0},
    ]
    //Ottavi e Quarti

    //Squadre ai quarti
    const qualifiedQuarter = []
    this.state.data.matches.filter((match) => 
    {
      return match.stage === "QUARTER_FINAL"; 
    }).map((mt) => {
      if (mt.homeTeam.name)
      {
        qualifiedQuarter.push(mt.homeTeam.name)
      }
      if (mt.awayTeam.name)
      {
        qualifiedQuarter.push(mt.awayTeam.name)
      }
    })
    this.state.names.map((player) => {
      var obje = listPlayers.find((obj) => Object.keys(obj)[0] === player)
      finalTable.finalTable[player]["ottavi"].map((team) => {
        if (result.result.risultati["ottavi"].includes(team))
        {
          obje[player] += 3
        }
      })
      finalTable.finalTable[player]["terze"].map((team) => {
        if (result.result.risultati["terze"].includes(team))
        {
          obje[player] += 5
        }
      })
      if (finalTable.finalTable[player]["A"][0] === result.result.risultati["A"][0])
        obje[player] += 5
      if (finalTable.finalTable[player]["A"][1] === result.result.risultati["A"][1])
        obje[player] += 5
      if (finalTable.finalTable[player]["B"][0] === result.result.risultati["B"][0])
        obje[player] += 5
      if (finalTable.finalTable[player]["B"][1] === result.result.risultati["B"][1])
        obje[player] += 5
      if (finalTable.finalTable[player]["C"][0] === result.result.risultati["C"][0])
        obje[player] += 5
      if (finalTable.finalTable[player]["C"][1] === result.result.risultati["C"][1])
        obje[player] += 5
      if (finalTable.finalTable[player]["D"][0] === result.result.risultati["D"][0])
        obje[player] += 5
      if (finalTable.finalTable[player]["D"][1] === result.result.risultati["D"][1])
        obje[player] += 5
      if (finalTable.finalTable[player]["E"][0] === result.result.risultati["E"][0])
        obje[player] += 5
      if (finalTable.finalTable[player]["E"][1] === result.result.risultati["E"][1])
        obje[player] += 5
      if (finalTable.finalTable[player]["F"][0] === result.result.risultati["F"][0])
        obje[player] += 5
      if (finalTable.finalTable[player]["F"][1] === result.result.risultati["F"][1])
        obje[player] += 5

      finalTable.finalTable[player]["quarti"].map((team) => {
        if (qualifiedQuarter.includes(team))
          obje[player] += 10
      })
    })
    
    this.state.data.matches.filter((match) => 
    {
      return match.stage === "GROUP_STAGE"; 
    }).map((match) => 
    {
      listPlayers.map((obj) => {
        var temp = match.homeTeam.name + "-" + match.awayTeam.name
        var matchString = temp.replace(/\s/g, '')
        var player = Object.keys(obj)[0];
        var home = match.score.homeTeam;
        var away = match.score.awayTeam;
        var homeGuess = players.players[player][matchString].home;
        var awayGuess = players.players[player][matchString].away;
        if (match.status === "SCHEDULED")
          return 
        if (home === homeGuess && away === awayGuess) {
          obj[player] += 7
          return
        }
        if ((home-away > 0 && homeGuess-awayGuess > 0) || (home-away === 0 && homeGuess-awayGuess === 0) || (home-away < 0 && homeGuess-awayGuess < 0))
        {
          obj[player] += 2
        }
        return
      })
    })
    return listPlayers.sort(function(a,b) {
      return b[Object.keys(b)[0]] - a[Object.keys(a)[0]]
    })
    .map((pos) => {
      return (
      <View key={Object.keys(pos)[0]} style={{
        marginBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <Text style={{
          fontSize: 4*vw,
          fontWeight: '600'
        }}>{Object.keys(pos)[0].charAt(0).toUpperCase() + Object.keys(pos)[0].slice(1)}</Text>
        <Text style={{
          fontSize: 4*vw,
          fontWeight: '600'
        }}>{pos[Object.keys(pos)[0]]}</Text>
      </View>)
    })
  }

  renderLast16 = () => {
    return this.state.data.matches.filter((match) => 
    {
      return match.stage === "LAST_16"; 
    }).sort((m1, m2) => {
      return m1.homeTeam.name - m2.homeTeam.name
    }).map((match) => 
    {
      var temp = match.homeTeam.name + "-" + match.awayTeam.name
      var matchString = temp.replace(/\s/g, '')
      var hour = parseInt(match.startDateTime.toString().substring(11,13)) + 2
      return (
        <View key={match.homeTeam.name + " " + match.awayTeam.name} style={{
          width: 80*vw,
          backgroundColor: match.status === "IN_PLAY" || match.status === "PAUSED" ? '#ffa500' : "#ffffff",
          alignItems: 'center',
          padding: 10,
          margin: 15,
          justifyContent: 'flex-start',
          borderRadius: 10,
          justifyContent: 'center',
          textAlign: 'center',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          
          elevation: 10,
        }}>
          <View>
            <Text>{match.status}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
            marginBottom: 3
          }}>
            <Text style={{
              fontSize: 4*vw
            }}>{match.startDateTime.toString().substring(0,10)}</Text>
            <Text style={{
              fontSize: 4*vw
            }}>{hour}:00</Text>
          </View>
          <View>
            <Text numberOfLines={1} style={{
              fontSize: 5.6*vw
            }}>{match.homeTeam.name} - {match.awayTeam.name}</Text>
          </View>
          <View>
            {match.score.homeTeam != null ? 
              <Text style={styles.result}>{match.score.homeTeam + " - " +  match.score.awayTeam}</Text> :
              <Text style={styles.result}>0 - 0</Text>
            }
          </View>
        </View>
      )
    })
  }

  renderMatches = () => {
    return this.state.data.matches.filter((match) => 
    {
      return match.stage === "GROUP_STAGE"  && match.status != "IN_PLAY" && match.status != "PAUSED"; 
    }).sort((m1, m2) => {
      return m1.homeTeam.name - m2.homeTeam.name
    }).map((match) => 
    {
      var temp = match.homeTeam.name + "-" + match.awayTeam.name
      var matchString = temp.replace(/\s/g, '')
      var hour = parseInt(match.startDateTime.toString().substring(11,13)) + 2
      return (
        <View key={match.homeTeam.name + " " + match.awayTeam.name} style={styles.matchBox}>
          <View>
            <Text>{match.status}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
            marginBottom: 3
          }}>
            <Text style={{
              fontSize: 4*vw
            }}>{match.startDateTime.toString().substring(0,10)}</Text>
            <Text style={{
              fontSize: 4*vw
            }}>{hour}:00</Text>
          </View>
          <View>
            <Text numberOfLines={1} style={{
              fontSize: 5.6*vw
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
            <View style={{
              backgroundColor: this.calcColor(match, "sgaro", matchString),
              width: "90%",
              borderRadius: 20,
              margin: 3
            }}>
              <Text style={{
                fontSize: 4.5*vw,
                color: 'white'
              }}>Sgaro: {players.players.sgaro[matchString].home + "-" + players.players.sgaro[matchString].away}</Text>
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
              color: 'white',
              fontStyle: 'italic'
            }}>TotoApp 2.0</Text>
          </View>
          <View style={styles.matchBox}>
            <Text style={{
              fontSize: 6*vw,
              fontWeight: 'bold'
            }}>Classifica</Text>
            {this.renderTable()}
          </View>
          <Cards />
          {this.renderLast16()}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6e0700',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column",
  },
  topbar: {
    height: 10*vh,
    width: 100*vw,
    backgroundColor: "#196f0c",
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    
    elevation: 10,
  },
  matchBox: {
    width: 80*vw,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    margin: 15,
    justifyContent: 'flex-start',
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    
    elevation: 10,
  },
  matchBoxInPlay: {
    width: 80*vw,
    backgroundColor: '#ffa500',
    alignItems: 'center',
    padding: 10,
    margin: 15,
    justifyContent: 'flex-start',
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    
    elevation: 10,
  },
  result: {
    fontSize: 9*vw,
    fontWeight: 'bold'
  },
});
