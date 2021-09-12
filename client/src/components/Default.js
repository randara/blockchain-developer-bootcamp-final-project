import React, { Component } from "react";

class Default extends Component {
  render() {
    return (
      <div className="App">
        <h1>Crypto Scholarships</h1>
        <h2>Welcome to Crypto Scholarships!</h2>
        <p>Please login with your MetaMask wallet and connect your account on the Rinkeby Test Network.</p>
        <small>(might need to add tests networks in MetaMask)</small>
      </div>
    )
  }
}

export default Default;
