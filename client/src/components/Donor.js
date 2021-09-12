import React, { Component } from "react";
import { MenuItem, Button, TextField } from '@mui/material';

class Donor extends Component {
  constructor(props) {
    // Might not be a good idea but this is my first react app.
    super(props);
    this.state = props.state;
  }

  // Page needs to be refreshed due to a bug or error or mistake made by me in comm, I'm still investigating....
  render() {
    return(
      <div>
      <h2>Donors</h2>

      <div>
        <p>
          Select the Scholarship and Amount. Click 'Donate' to initiate a transaction. Once the transaction is complete, please refresh page to check the Scholarships above for updated values. 'Balance' will be increased and 'Need' will be decreased.
        </p>
        <div>
          <div>
            <TextField
              id="select-scholarship"
              select
              label="Select Scholarship"
              required
              value={this.state.inputDonorValue}
              helperText={this.state.inputDonorValueError ? "This is a required field" : ""}
              error={this.state.inputDonorValueError}
              onChange={this.handleDonorInputChange.bind(this)}
              size="small"
              fullWidth
              style={{marginBottom: '10px'}}
            >
              {this.state.scholarshipList.map((item, index) => (
                <MenuItem key={index} value={index}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="enter-amount"
              label="Amount"
              variant="outlined"
              required
              value={this.state.inputDonorAmountValue}
              helperText={this.state.inputDonorAmountValueError ? "Requires a positive number" : ""}
              error={this.state.inputDonorAmountValueError}
              onChange={this.handleDonorAmountInputChange.bind(this)}
              size="small"
              fullWidth
            />
          </div>

          <br/>
            <div>
              <Button size="small" onClick={this.handleDonateButtonClick.bind(this)}>
                Donate
              </Button>

              <Button size="small" onClick={this.handleDonorResetButtonClick.bind(this)}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleDonorInputChange(event) {
    this.setState({ inputDonorValue: event.target.value });
  }

  handleDonorAmountInputChange(event) {
    this.setState({ inputDonorAmountValue: event.target.value });
  }

  handleDonorResetButtonClick(event) {
    this.setState({
      inputDonorValue: "",
      inputDonorAmountValue: "",
      inputDonorAmountValueError: false,
      inputDonorValueError: false
    });
  }

  handleDonateButtonClick = async (event) => {
    try{
      if(this.state.inputDonorValue === "")
        await this.setState({ inputDonorValueError: true });
      else
        await this.setState({ inputDonorValueError: false });

      if(this.state.inputDonorAmountValue === "")
        await this.setState({ inputDonorAmountValueError: true });
      else if (isNaN(this.state.inputDonorAmountValue)) {
        await this.setState({ inputDonorAmountValueError: true });
      } else if (this.state.inputDonorAmountValue<0)
        await this.setState({ inputDonorAmountValueError: true });
      else
        await this.setState({ inputDonorAmountValueError: false });

      if(!this.state.inputDonorValueError && !this.state.inputDonorAmountValueError) {
        let scholarshipList = [];
        await this.state.contract.methods
        .sendDonation(this.state.inputDonorValue)
        .send({ from: this.state.accounts[0], value: Math.round(this.state.inputDonorAmountValue) })
        .catch((error) => {
          alert(`Transaction error. Please try again. ${'\n'} Error: ${error.message}` )
        });

        for(let i=0; i<this.state.scholarshipListLength; i++) {
          const scholarshipValue = await this.state.contract.methods
          .getScholarshipValues(i)
          .call()
          .catch((error) => {
            console.log(error);
          });

          scholarshipList.push({name: scholarshipValue[0], balance: scholarshipValue[1], need: scholarshipValue[2]});
        }
        this.setState({ inputDonorValue: "", inputDonorAmountValue: "", scholarshipList: scholarshipList });
      }
    } catch(error) {
      console.log(error);
    }
  }
}

export default Donor;
