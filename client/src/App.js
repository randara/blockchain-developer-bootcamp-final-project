// Requires react 17.x and over for material-ui. Truffle Unbox React installs react 16.x.
import React, { Component } from "react";
import CryptoScholarship from "./contracts/CryptoScholarship.json";

import getWeb3 from "./getWeb3";
import Default from "./components/Default.js";
import Header from "./components/Header.js";
import Scholarships from "./components/Scholarships.js";
import Universities from "./components/Universities.js";
import Donor from "./components/Donor.js"
import Footer from "./components/Footer.js";
import ToDo from "./components/ToDo.js";

import "./App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    contractAddress: null,
    scholarshipList: null,
    scholarshipListLength: null,
    inputCreateScholarshipValue: '',
    inputCreateScholarshipValueError: false,
    inputCreateNeedAmount: '',
    inputCreateNeedAmountError: false,
    inputUpdateScholarshipValue: '',
    inputUpdateScholarshipValueError: false,
    inputUpdateNeedAmount: '',
    inputUpdateNeedAmountError: false,
    inputDonorValue: '',
    inputDonorValueError: false,
    inputDonorAmountValue: '',
    inputDonorAmountValueError: false
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CryptoScholarship.networks[networkId];
      const instance = new web3.eth.Contract(CryptoScholarship.abi, deployedNetwork && deployedNetwork.address);
      const scholarshipListLength = await instance.methods.getScholarshipListLength().call();

      let scholarshipList = [];

      for(let i=0; i<scholarshipListLength; i++) {
        const scholarshipValue = await instance.methods.getScholarshipValues(i).call();
        scholarshipList.push({name: scholarshipValue[0], balance: scholarshipValue[1], need: scholarshipValue[2]});
      }

      this.setState({
        web3,
        accounts,
        contract: instance,
        contractAddress: deployedNetwork.address,
        scholarshipListLength,
        scholarshipList
      }, this.runExample);
    } catch (error) {
      alert(
        'Error loading. Please ensure you have logged into you MetaMask wallet and connected your account on the Rinkeby Test Network.'
      );
      console.error(error);
    }
  };

  runExample = async () => {};

  render() {
    if (!this.state.web3) {
      return <Default/>
    }
    // Scholarships can be refactored into smaller components.

    return (
      <div className="App">
        <Header contractAddress={this.state.contractAddress} accounts={this.state.accounts} />

        <h2>Scholarships</h2>
        <p> Scholarships, balances, and need below </p>

        <div>
          {
            this.state.scholarshipListLength ?
            <div>
              <Scholarships state={this.state}/>
            </div>
            :
            <p>
              No Scholarships found.
            </p>
          }
        </div>

        <Universities state={this.state} />
        <Donor state={this.state} />
        <ToDo />
        <Footer />
      </div>
    );
  }
}

export default App;
