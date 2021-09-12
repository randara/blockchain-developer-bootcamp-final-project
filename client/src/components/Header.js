import React, { Component } from "react";
import { TextField } from '@mui/material';

class Header extends Component {
  render() {
    return (
      <div>
        <h1>Crypto Scholarships</h1>
        
        <div>
          <p> Donors can donate crypto to any Scholarships in the smart contract. Universities can send funds from the smart contract to their address when needed.</p>
        </div>
        <div>
          <TextField
           label="Smart Contract Address in Testnet (Read Only)"
           defaultValue={this.props.contractAddress}
           InputProps={{readOnly: true}}
           style={{margin: '1vw', width: '30vw'}}
         />
        </div>
        <div>
          <TextField
           label="MetaMask Account (Read Only)"
           defaultValue={this.props.accounts[0]}
           helperText="You can disconnect this account in MetaMask."
           InputProps={{readOnly: true}}
           style={{margin: '1vw', width: '30vw'}}
         />
        </div>

        <small>
          If the balance of a scholarship is not enough to cover students, Universities can update what they "need" so that donors can donate accordingly.
        </small>
      </div>
    )
  }
}

export default Header;
