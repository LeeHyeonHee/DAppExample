import React, { Component } from "react";
import getWeb3 from "./getWeb3.js"
import ShopContract from "./contracts/Shop.json";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shopInstance: null, 
      myAccount: null,
      myApples: 0,
      web3: null
    };
  }

  componentWillMount () {
    getWeb3()
      .then(results => {
        this.setState({
          web3: results.web3
        });

        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }


  instantiateContract() {
    const contract = require("truffle-contract");
    const shop = contract(ShopContract);
    shop.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts((error, accounts) => {
      if(!error) {
        shop.deployed().then(instance => {
          this.setState({shopInstance: instance, myAccount: accounts[0]});
          this.updateMyApples();
        })
      }
    })
  }

  buyApple() {
    this.state.shopInstance.buyApple({
      from: this.state.myAccount,
      value: this.state.web3.toWei(10, "ether"),
      gas: 900000
    });
  }

  sellApple() {
    this.state.shopInstance.sellMyApple(this.state.web3.toWei(10,"ether"), {
      from: this.state.myAccount,
      gas: 900000
    });
  }

  updateMyApples() {
    this.state.shopInstance.getMyApples().then(result => {
      this.setState({myApples: result.toNumber()});
    })
  }

  render() {
    return (
      <div className="App">
        <h1>사과의 가격: 10 ETH</h1>
        <button onClick={() => this.buyApple()}>구매하기</button>
        <p>내가 가진 사과: {this.state.myApples}</p>
        <button onClick={() => this.sellApple()}>
          판매하기 (판매 가격: {10 * this.state.myApples})
        </button>
      </div>
    );
  }
}

export default App;