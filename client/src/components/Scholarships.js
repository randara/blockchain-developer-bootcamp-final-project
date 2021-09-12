import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { Component } from "react";

class Scholarships extends Component {
  constructor(props) {
    // Might not be a good idea but this is my first react app.
    super(props);
    this.state = props.state;
  }

  render() {
    return (
      <div>
        <TableContainer>
          <Table sx={{ minWidth: 500 }} aria-label="category table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{fontWeight: 'bold'}}>SCHOLARSHIP NAME</TableCell>
                <TableCell align="right" style={{fontWeight: 'bold'}}>BALANCE (in wei)</TableCell>
                <TableCell align="right" style={{fontWeight: 'bold'}}>NEED (in wei)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.scholarshipList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{item.name}</TableCell>
                  <TableCell align="right">{item.balance}</TableCell>
                  <TableCell align="right">{item.need}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
}

export default Scholarships;
