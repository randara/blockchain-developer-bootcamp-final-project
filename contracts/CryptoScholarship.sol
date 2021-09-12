// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoScholarship is Ownable {
  struct Scholarship {
    uint scholarshipId;
    string scholarshipName;
    uint scholarshipBalance;
    uint scholarshipNeed;
  }

  uint currentScholarshipId;

  Scholarship[] public scholarshipList;

  event LogCreateScholarship(string message, uint scholarshipId, string scholarshipName, uint scholarshipBalance, uint scholarshipNeed);
  event LogNameUpdated(string message, uint scholarshipId, string scholarshipName, uint scholarshipBalance, uint scholarshipNeed);
  event LogNeedUpdated(string message, uint scholarshipId, string scholarshipName, uint scholarshipBalance, uint scholarshipNeed);
  event LogDonation(string message, uint scholarshipId, string scholarshipName, uint scholarshipBalance, uint scholarshipNeed);

  modifier scholarshipIdValidity(uint _scholarshipId) {
    require(
      _scholarshipId >= 0 && _scholarshipId < scholarshipList.length,
      "Scholarship ID should be >= 0 and < scholarshipList.length"
    );
    _;
  }

  modifier scholarshipNeedValidity(uint _scholarshipNeed) {
    require(
      _scholarshipNeed >= 0,
      "Scholarship Need should be >= 0"
    );
    _;
  }

  modifier donationValidity() {
    require(
      msg.value >= 0,
      "Donation (msg.value) should be >= 0"
    );
    _;
  }

  constructor() public {
    currentScholarshipId = scholarshipList.length;
  }

  function createScholarship(string memory _scholarshipName, uint _scholarshipNeed)
    public
    scholarshipNeedValidity(_scholarshipNeed)
    returns(bool)
  {
    scholarshipList.push(Scholarship({scholarshipId: currentScholarshipId, scholarshipName: _scholarshipName, scholarshipBalance: 0, scholarshipNeed: _scholarshipNeed}));
    assert(scholarshipList[currentScholarshipId].scholarshipBalance == 0);
    emit LogCreateScholarship(
      "Scholarship Successfully Created",
      scholarshipList[currentScholarshipId].scholarshipId,
      scholarshipList[currentScholarshipId].scholarshipName,
      scholarshipList[currentScholarshipId].scholarshipBalance,
      scholarshipList[currentScholarshipId].scholarshipNeed
    );
    currentScholarshipId++;
    return true;
  }

  function updateScholarshipName(uint scholarshipId, string memory scholarshipName)
    public
    onlyOwner
    scholarshipIdValidity(scholarshipId)
    returns(bool)
  {
    scholarshipList[scholarshipId].scholarshipName = scholarshipName;
    emit LogNameUpdated(
      "Scholarship Name Update Successful",
      scholarshipList[scholarshipId].scholarshipId,
      scholarshipList[scholarshipId].scholarshipName,
      scholarshipList[scholarshipId].scholarshipBalance,
      scholarshipList[scholarshipId].scholarshipNeed
    );
    return true;
  }

  function updateScholarshipNeed(uint _scholarshipId, uint _scholarshipNeed)
    public
    scholarshipIdValidity(_scholarshipId)
    scholarshipNeedValidity(_scholarshipNeed)
    returns(bool)
  {
    uint oldScholarshipNeed = scholarshipList[_scholarshipId].scholarshipNeed;
    scholarshipList[_scholarshipId].scholarshipNeed += _scholarshipNeed;
    assert(scholarshipList[_scholarshipId].scholarshipNeed >= oldScholarshipNeed);
    emit LogNeedUpdated(
      "Scholarship Need Successfully Updated",
      scholarshipList[_scholarshipId].scholarshipId,
      scholarshipList[_scholarshipId].scholarshipName,
      scholarshipList[_scholarshipId].scholarshipBalance,
      scholarshipList[_scholarshipId].scholarshipNeed
    );
    return true;
  }

  function sendDonation(uint scholarshipId)
    public
    payable
    donationValidity()
    scholarshipIdValidity(scholarshipId)
    returns(bool)
  {

    uint oldScholarshipBalance = scholarshipList[scholarshipId].scholarshipBalance;
    scholarshipList[scholarshipId].scholarshipBalance+=msg.value;
    assert(scholarshipList[scholarshipId].scholarshipBalance >= oldScholarshipBalance);

    uint oldScholarshipNeed = scholarshipList[scholarshipId].scholarshipNeed;
    if(msg.value > scholarshipList[scholarshipId].scholarshipNeed) scholarshipList[scholarshipId].scholarshipNeed = 0;
    else scholarshipList[scholarshipId].scholarshipNeed-=msg.value;
    assert(scholarshipList[scholarshipId].scholarshipNeed >= 0 && scholarshipList[scholarshipId].scholarshipNeed <= oldScholarshipNeed);
    emit LogDonation(
      "Donation Successful",
      scholarshipList[scholarshipId].scholarshipId,
      scholarshipList[scholarshipId].scholarshipName,
      scholarshipList[scholarshipId].scholarshipBalance,
      scholarshipList[scholarshipId].scholarshipNeed
    );
    return true;
  }

  function getScholarshipValues(uint scholarshipId)
    public
    view
    scholarshipIdValidity(scholarshipId)
    returns(string memory, uint, uint)
  {
    return (scholarshipList[scholarshipId].scholarshipName, scholarshipList[scholarshipId].scholarshipBalance, scholarshipList[scholarshipId].scholarshipNeed);
  }

  function getScholarshipListLength()
    public
    view
    returns(uint)
  {
    return scholarshipList.length;
  }
}
