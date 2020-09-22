import React, { Component } from 'react'
import Web3 from 'web3'
import Lottery from './abis/Lottery.json'
//import DappToken from '../abis/DappToken.json'
//import TokenFarm from '../abis/TokenFarm.json'
//import Navbar from './Navbar'
//import Main from './Main'
import './App.css'
//const web3 = window.web3;

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    
    
    //Loads Lottery contract
    const lotteryData = Lottery.networks[networkId];
    if(lotteryData){
      
      const lottery = new web3.eth.Contract(Lottery.abi, lotteryData.address);
      this.setState({lottery});
      
      let manager = await lottery.methods.manager().call();
      let players = await lottery.methods.getPlayers().call({from: this.state.account});
      let poolBalance = await web3.eth.getBalance(lottery.options.address);
      let Balance = web3.utils.fromWei(poolBalance.toString(), 'ether')
      this.setState({manager, players, Balance})
      this.setState({})
  } else {
    window.alert('Not deployed to network');
  }
  this.setState({loading: false});

}

  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      lottery: {},
      manager: '',
      players: [],
      poolBalance: '', 
      loading: true,
      account: '0x0',
      value: '',
      winner: ''
      

    }
  }

  onSubmit = async (event) =>{
    const web3 = window.web3;
    event.preventDefault();
    this.setState({message: 'Waiting for transaction to complete'})
   // const accounts = await web3.eth.getAccounts();
    await this.state.lottery.methods.enter().send({
      from: this.state.account,  value: web3.utils.toWei(this.state.value)     
    });
    this.setState({message: 'You have been entered'});
  }

  onClick = async ()=> {
    const web3 = window.web3;
    //const networkId = await web3.eth.net.getId();
    
    
    //Loads Lottery contract
    //const lotteryData = Lottery.networks[networkId];
    //const lottery = await Lottery.deployed();
    //const accounts = await web3.eth.getAccounts();
    await this.state.lottery.methods.pickWinner().send({from: this.state.account});
    this.setState({winner: await this.state.lottery.methods.winner().call()})


  }
  

  render() {
    return (
      <div>
        <h2>Lottery contract </h2>
        <p>The manager is {this.state.manager}</p>
    <p>The pool of lottery is {this.state.Balance} ether!
    this account is {this.state.account}</p>
        <hr />

        <form onSubmit={this.onSubmit}>
            <h4>Try your luck </h4>
            <div>
              <label>Amount of ether to enter:</label>
              <input onChange={event => this.setState({ value: event.target.value})}></input>
            </div>
            <button>Enter</button>
        </form>
        <hr />
    <h1>{this.state.message}</h1>
    <hr />
    <h4>Ready to pick a winner</h4>
      <button onClick={this.onClick}>Pick a winner</button> 
      <h1>{this.state.winner}</h1>

      </div>
    );
  }
}

export default App;
