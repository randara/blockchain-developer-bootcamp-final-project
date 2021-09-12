import React, { Component } from "react";
import { Typography, MenuItem, Button, TextField } from '@mui/material';

class Universities extends Component {
  constructor(props) {
    // Might not be a good idea but this is my first react app.
    super(props);
    this.state = props.state;
  }

  handleCreateButtonClick = async (event) => {
    try{
      if(this.state.inputCreateScholarshipValue === "")
        await this.setState({inputCreateScholarshipValueError: true});
      else
        await this.setState({inputCreateScholarshipValueError: false});

      if(this.state.inputCreateNeedAmount === "")
        await this.setState({inputCreateNeedAmountError: true});
      else if(isNaN(this.state.inputCreateNeedAmount)) {
        await this.setState({inputCreateNeedAmountError: true});
      } else if(this.state.inputCreateNeedAmount<0)
        await this.setState({inputCreateNeedAmountError: true});
      else
        await this.setState({inputCreateNeedAmountError: false});

      if(!this.state.inputCreateScholarshipValueError && !this.state.inputCreateNeedAmountError) {
        let scholarshipList = [];
        await this.state.contract.methods
        .createScholarship(this.state.inputCreateScholarshipValue, Math.round(this.state.inputCreateNeedAmount))
        .send({ from: this.state.accounts[0] })
        .catch((error) => {
          alert(`Transaction error. Please try again. ${'\n'} Error: ${error.message}`)
        });

        const scholarshipListLength = await this.state.contract.methods.getScholarshipListLength().call();

        for(let i=0; i<scholarshipListLength; i++) {
          const scholarshipValue = await this.state.contract.methods
            .getScholarshipValues(i)
            .call()
            .catch((error) => {
              console.log(error);
            });
          scholarshipList.push({name: scholarshipValue[0], balance: scholarshipValue[1], need: scholarshipValue[2]});
        }
        this.setState({ inputCreateScholarshipValue: "", inputCreateNeedAmount: "", scholarshipList, scholarshipListLength });
      }
    } catch(error) {
        console.log(error);
    }
  }

  handleCreateScholarshipInputChange(event) {
    this.setState({ inputCreateScholarshipValue: event.target.value });
  }

  handleCreateNeedInputChange(event) {
    this.setState({ inputCreateNeedAmount: event.target.value });
  }

  handleCreateResetButtonClick(event) {
    this.setState({
      inputCreateScholarshipValue: "",
      inputCreateNeedAmount: "",
      inputCreateScholarshipValueError: false,
      inputCreateNeedAmountError: false
    });
  }

  handleUpdateScholarshipInputChange(event) {
    this.setState({ inputUpdateScholarshipValue: event.target.value });
  }

  handleUpdateNeedInputChange(event) {
    this.setState({ inputUpdateNeedAmount: event.target.value });
  }

  handleUpdateResetButtonClick(event) {
    this.setState({
      inputUpdateScholarshipValue: "",
      inputUpdateNeedAmount: "",
      inputUpdateScholarshipValueError: false,
      inputUpdateNeedAmountError: false
    });
  }

  handleUpdateButtonClick = async (event) => {
    try{
      if(this.state.inputUpdateScholarshipValue === "")
        await this.setState({inputUpdateScholarshipValueError: true});
      else
        await this.setState({inputUpdateNeedAmountError: false});

      if(this.state.inputUpdateNeedAmount === "")
        await this.setState({inputUpdateNeedAmountError: true});
      else if(isNaN(this.state.inputUpdateNeedAmount)) {
        await this.setState({inputUpdateNeedAmountError: true});
      } else if(this.state.inputUpdateNeedAmount<0)
        await this.setState({inputUpdateNeedAmountError: true});
      else
        await this.setState({inputUpdateNeedAmountError: false});

      if(!this.state.inputUpdateScholarshipValueError && !this.state.inputUpdateNeedAmountError) {
        let scholarshipList = [];
        await this.state.contract.methods
        .updateScholarshipNeed(this.state.inputUpdateScholarshipValue, Math.round(this.state.inputUpdateNeedAmount))
        .send({ from: this.state.accounts[0] })
        .catch((error) => { alert(`Transaction was NOT sent. Please try again, perhaps after resetting your account. ${'\n'} Error: ${error.message}`)});
        const scholarshipListLength = await this.state.contract.methods.getScholarshipListLength().call();
        for(let i=0; i<scholarshipListLength; i++) {
          const scholarshipValue = await this.state.contract.methods
            .getScholarshipValues(i)
            .call()
            .catch((error) => { console.log("Error", error)});
          scholarshipList.push({name: scholarshipValue[0], balance: scholarshipValue[1], need: scholarshipValue[2]});
        }
        this.setState({ inputUpdateScholarshipValue: "", inputUpdateNeedAmount: "", scholarshipList, scholarshipListLength });
      }
    } catch(error) {
        console.log("Details: ", error)
    }
  }

  render() {
    return (
      <div>
        <h2>Universities</h2>
        <div>
          <p>
            If you want to create a new Scholarship, please submit the form below. Click 'Create Scholarship' to initiate a transaction. Once the transaction is complete, please refresh the page so the Scholarship above for updated values. A new Scholarship will be created, its 'Balance' will be 0, and its 'Need' will be updated.
          </p>
          <div>
            <div>
              <TextField
                id="enter-Scholarship"
                label="Scholarship Name"
                variant="outlined"
                required
                value={this.state.inputCreateScholarshipValue}
                helperText={this.state.inputCreateScholarshipValueError ? "This is a required field" : ""}
                error={this.state.inputCreateScholarshipValueError}
                onChange={this.handleCreateScholarshipInputChange.bind(this)}
                size="small"
                fullWidth
                style={{marginBottom: '10px'}}
              />

              <TextField
                id="enter-need"
                label="Scholarship Need"
                variant="outlined"
                required
                value={this.state.inputCreateNeedAmount}
                helperText={this.state.inputCreateNeedAmountError ? "Requires a positive number" : ""}
                error={this.state.inputCreateNeedAmountError}
                onChange={this.handleCreateNeedInputChange.bind(this)}
                size="small"
                fullWidth
              />
            </div>

            <br/>

            <div>
              <Button size="small" onClick={this.handleCreateButtonClick.bind(this)}>
                Create Scholarship
              </Button>
              <Button size="small" onClick={this.handleCreateResetButtonClick.bind(this)}>
                Clear
              </Button>
            </div>
          </div>
        </div>


        <div>
          <p>
            If you want to update 'need' for one of the existing Scholarships, please submit the form below. Click 'Update Scholarship Need' to initiate a transaction. Once the transaction is complete, please refresh the page so the Scholarships above for the updated values. 'Need' total will be increased by the value you entered.
          </p>
          <div>
            <div>
              <TextField
                id="select-scholarship"
                select
                label="Select Scholarship"
                required
                value={this.state.inputUpdateScholarshipValue}
                helperText={this.state.inputUpdateScholarshipValueError ? "This is a required field" : ""}
                error={this.state.inputUpdateScholarshipValueError}
                onChange={this.handleUpdateScholarshipInputChange.bind(this)}
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
                id="enter-need"
                label="Additional Scholarship Need"
                variant="outlined"
                required
                value={this.state.inputUpdateNeedAmount}
                helperText={this.state.inputUpdateNeedAmountError ? "Requires a positive number" : ""}
                error={this.state.inputUpdateNeedAmountError}
                onChange={this.handleUpdateNeedInputChange.bind(this)}
                size="small"
                fullWidth
              />
            </div>

            <br/>

            <div>
              <Button size="small" onClick={this.handleUpdateButtonClick.bind(this)}>
                Update Scholarship Need
              </Button>
              <Button size="small" onClick={this.handleUpdateResetButtonClick.bind(this)}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Universities;
