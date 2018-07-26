//=====================================import React tools===============================================
//import React tools
import React, {Component} from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Switch 
} from "react-router-dom";
import axios from "axios";
//======================================import pages============================================================
//import pages
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import NoMatchPage from "./pages/NoMatch";

//======================================import API================================================================
import StockAPI from "./utils/API";

//======================================Logic for Secured Login Page=============================================
class App extends Component{
  constructor(props) {
    super(props)

    const sessionState = sessionStorage.getItem("state");

    if(sessionState){
      this.state = JSON.parse(sessionStorage.getItem("state"));
    }else{
      this.state = {
        loggedIn:false,
        username:'',
        tickerList:[],
        selectedTickers:[],
        notes:[]
      }
    }
  }
 
  signUp = (e, username, password) => {
    e.preventDefault();
    const user = {
      "username": username,
      "password": password
    };

    console.log(user);
    axios.post("/api/user", user).then(res => {
      console.log(res);
      alert(res.data.message);
      this.setState({
        loggedIn:res.data.loggedIn,
        username:res.data.username
      });
    });
    sessionStorage.setItem("state",JSON.stringify(this.state));
  }
 
  logIn = (e, username, password) => {
    e.preventDefault();
    const user = {
      "username": username,
      "password": password
    };
    axios.post("/api/user/login", user).then(res => {
      console.log(res.data);
      alert(res.data.message);
      this.setState({
        loggedIn:res.data.loggedIn,
        username:res.data.username,
      });
      
      sessionStorage.setItem("state",JSON.stringify(this.state));
    })
  }

  logOut = (e) => {
    e.preventDefault();
    console.log(this.state);

    this.setState({
      loggedIn: false,
      username:"",
      tickerList:[],
      notes:[]
    });
    console.log("saving the state below");
    console.log(this.state);

    sessionStorage.setItem("state",JSON.stringify(this.state));
  }

  searchTicker = (query) => {
      if (query){
          StockAPI.searchSymbol(query.trim()).then(res=>{
              console.log("API::SearchSymbol::SUCCESS");
              //add ticker to list
              let newTickers = this.state.tickerList;
              const newTIcker = {
                  ticker: query,
                  logoURL: res.data.url
              }
              newTickers.push(newTIcker);
              this.setState({ Tickers: newTickers});
              sessionStorage.setItem("state",JSON.stringify(this.state));
          }).catch(error=>{
              console.log("API::SearchSymbol::FAIL");
          });
      }
  };

  selectTicker = (tickerObj)=>{
    for (let i=0; i<this.state.selectedTickers.length; i++){
      if (tickerObj.ticker == this.state.selectedTickers[i].ticker){
        return;
      }
    }
    let newSelectedTickers = this.state.selectedTickers;
    const selectedTicker = tickerObj;
    newSelectedTickers.push(selectedTicker);
    this.setState({selectedTickers:newSelectedTickers});
    sessionStorage.setItem("state",JSON.stringify(this.state));
}

  removeChip = (tickerIndex)=>{
    let newSelectedTickers = this.state.selectedTickers;
    newSelectedTickers.splice(tickerIndex,1);
    this.setState({selectedTickers:newSelectedTickers});
    sessionStorage.setItem("state",JSON.stringify(this.state));
  }





  addNote = (noteText)=>{
    let newNotes = this.state.notes;
    newNotes.push({
      text:noteText,
      beingEdited:false
    });
    this.setState({notes:newNotes});
    sessionStorage.setItem("state",JSON.stringify(this.state));
  }

  deleteNote = (noteIndex)=>{
    let newNotes = this.state.notes;
    newNotes.splice(noteIndex,1);
    this.setState({notes:newNotes});
    sessionStorage.setItem("state",JSON.stringify(this.state));
  }

  updateNote = (noteText,noteIndex)=>{
    let newNotes = this.state.notes;
    newNotes[noteIndex].text = noteText;
    newNotes[noteIndex].beingEdited = false;
    this.setState({notes:newNotes});
    sessionStorage.setItem("state",JSON.stringify(this.state));
  }

  editNote = (noteIndex)=>{
    let newNotes = this.state.notes;
    newNotes[noteIndex].beingEdited = true;
    this.setState({notes:newNotes});    
  }

  cancleEditNote = (noteIndex)=>{
    let newNotes = this.state.notes;
    newNotes[noteIndex].beingEdited = false;
    this.setState({notes:newNotes});
  }

  
  render(){
    return (
      <Router>
          <Switch>
            <Route 
              exact 
              path="/" 
              render={()=>
                <HomePage 
                  username={this.state.username}

                  tickerList = {this.state.tickerList}
                  selectedTickers = {this.state.selectedTickers}
                  handleSearchTicker = {this.searchTicker}
                  handleSelectTicker = {this.selectTicker}

                  handleRemoveChip = {this.removeChip}

                  notes = {this.state.notes}
                  handleAddNote = {this.addNote}
                  handleDeleteNote = {this.deleteNote}
                  handleEditNote = {this.editNote}
                  handleUpdateNote = {this.updateNote}
                  handleCancleEditNote = {this.cancleEditNote}
                />} />
            <Route
              exact
              path="/login"
              render={()=>
                <LoginPage
                  loggedIn={this.state.loggedIn}
                  username={this.state.username}
                  signUp={this.signUp}
                  logIn={this.logIn}
                  logOut={this.logOut}
                />} />
            <Route render={()=><NoMatchPage />} />
          </Switch>
      </Router>
    );
  }
 }
 
 
 export default App;
