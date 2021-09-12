const CryptoScholarship = artifacts.require("./CryptoScholarship.sol");
const { catchRevert } = require("./exceptionHelpers.js");

contract("CryptoScholarship", accounts => {
  it("should create a new scholarship.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    await cryptoScholarshipInstance.createScholarship("USB", 1000, { from: accounts[0] });
    const scholarshipListLength = await cryptoScholarshipInstance.getScholarshipListLength();
    assert.equal(scholarshipListLength, 1);
    const scholarshipItem = await cryptoScholarshipInstance.getScholarshipValues(0);
    assert.equal(scholarshipItem[0], "USB", "Newly added scholarship should have name 'USB'.");
    assert.equal(scholarshipItem[1], 0, "Newly added scholarship should have balance 0.");
    assert.equal(scholarshipItem[2], 1000, "Newly added scholarship should have need 1000.");
  });

  it("should update name of an existing scholarship when initiated by owner.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    await cryptoScholarshipInstance.updateScholarshipName(0, "USB engineering", { from: accounts[0] });
    const scholarshipListLength = await cryptoScholarshipInstance.getScholarshipListLength();
    assert.equal(scholarshipListLength, 1, "Length of the scholarship list should be 1.");
    const scholarshipItem = await cryptoScholarshipInstance.getScholarshipValues(0);
    assert.equal(scholarshipItem[0], "USB engineering", "Updated scholarship should have name 'USB engineering'.");
    assert.equal(scholarshipItem[1], 0, "Updated scholarship should have balance 0.");
    assert.equal(scholarshipItem[2], 1000, "Updated scholarship should have need 300.");
  });

  it("should not update name of an existing scholarship when initiated by non-owner.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    await catchRevert(cryptoScholarshipInstance.updateScholarshipName(0, "USB and UCV", { from: accounts[1] }));
    const scholarshipListLength = await cryptoScholarshipInstance.getScholarshipListLength();
    assert.equal(scholarshipListLength, 1, "Length of the scholarship list should be 1.");
  });

  it("should update need of an existing scholarship.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    await cryptoScholarshipInstance.updateScholarshipNeed(0, 500, { from: accounts[0] });
    const scholarshipListLength = await cryptoScholarshipInstance.getScholarshipListLength();
    assert.equal(scholarshipListLength, 1, "Length of the scholarship list should be 1.");
    const scholarshipItem = await cryptoScholarshipInstance.getScholarshipValues(0);
    assert.equal(scholarshipItem[0], "USB engineering", "Updated scholarship should have name 'USB engineering'.");
    assert.equal(scholarshipItem[1], 0, "Updated scholarship should have balance 0.");
    assert.equal(scholarshipItem[2], 1500, "Updated scholarship should have need 1500.");
  });

  it("should update balance and need after donation is successful.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    await cryptoScholarshipInstance.sendDonation(0, { from: accounts[0], value: 300});
    const scholarshipListLength = await cryptoScholarshipInstance.getScholarshipListLength();
    assert.equal(scholarshipListLength, 1, "Length of the scholarship list should be 1.");
    const scholarshipItem = await cryptoScholarshipInstance.getScholarshipValues(0);
    assert.equal(scholarshipItem[0], "USB engineering", "Donated scholarship should have name 'USB engineering'.");
    assert.equal(scholarshipItem[1], 300, "Donated scholarship should have balance 300.");
    assert.equal(scholarshipItem[2], 1200, "Donated scholarship should have need 1200.");
  });

  it("should update need to 0 when donation is greater than total need.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    await cryptoScholarshipInstance.sendDonation(0, { from: accounts[0], value: 1200});
    const scholarshipListLength = await cryptoScholarshipInstance.getScholarshipListLength();
    assert.equal(scholarshipListLength, 1, "Length of the scholarship list should be 1.");

    const scholarshipItem = await cryptoScholarshipInstance.getScholarshipValues(0);
    assert.equal(scholarshipItem[0], "USB engineering", "Donated scholarship should have name 'USB engineering'.");
    assert.equal(scholarshipItem[1], 1500, "Donated scholarship should have balance 1500.");
    assert.equal(scholarshipItem[2], 0, "Donated scholarship should have need 0.");
  });

  it("should create one additional scholarship, bringing list total to 2.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    await cryptoScholarshipInstance.createScholarship("UCAB", 300, { from: accounts[0] });
    const scholarshipListLength = await cryptoScholarshipInstance.getScholarshipListLength();
    assert.equal(scholarshipListLength, 2, "Length of the scholarship list should be 2.");
    const scholarshipItem1 = await cryptoScholarshipInstance.getScholarshipValues(0);
    assert.equal(scholarshipItem1[0], "USB engineering", "First scholarship should have name 'USB engineering'.");
    assert.equal(scholarshipItem1[1], 1500, "First scholarship should have balance 1500.");
    assert.equal(scholarshipItem1[2], 0, "First scholarship should have need 0.");
    const scholarshipItem2 = await cryptoScholarshipInstance.getScholarshipValues(1);
    assert.equal(scholarshipItem2[0], "UCAB", "Second scholarship should have name 'UCAB'.");
    assert.equal(scholarshipItem2[1], 0, "Second scholarship should have balance 0.");
    assert.equal(scholarshipItem2[2], 300, "Second scholarship should have need 300.");
  });

  it("should revert if scholarshipId is invalid.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    const scholarshipListLength = await cryptoScholarshipInstance.getScholarshipListLength();
    assert.equal(scholarshipListLength, 2, "Length of the scholarship list should be 2.");
    await catchRevert(cryptoScholarshipInstance.getScholarshipValues(scholarshipListLength));
    await catchRevert(cryptoScholarshipInstance.updateScholarshipNeed(scholarshipListLength+1, 200, { from: accounts[0] }));
    await catchRevert(cryptoScholarshipInstance.sendDonation(scholarshipListLength+2, { from: accounts[0], value: 2000}));
  });

  it("should emit a LogCreateScholarship event when an new scholarship is created.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    const result = await cryptoScholarshipInstance.createScholarship("UCV", 100, { from: accounts[0] });
    const item =  result.logs[0].args;
    assert.equal(item.message, "Scholarship Successfully Created", "LogCreateScholarship event 'message' property not emitted.");
    assert.equal(item.scholarshipId, 2, "LogCreateScholarship event 'scholarshipId' property not emitted.");
    assert.equal(item.scholarshipName, "UCV", "LogCreateScholarship event 'scholarshipName' property not emitted.");
    assert.equal(item.scholarshipBalance, 0, "LogCreateScholarship event 'scholarshipBalance' property not emitted.");
    assert.equal(item.scholarshipNeed, 100, "LogCreateScholarship event 'scholarshipNeed' property not emitted.");
  });

  it("should emit a LogNameUpdated event when name of an existing scholarship is updated.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    const result = await cryptoScholarshipInstance.updateScholarshipName(2, "UCV engineering", { from: accounts[0] });
    const item =  result.logs[0].args;
    assert.equal(item.message, "Scholarship Name Update Successful", "LogCreateScholarship event 'message' property not emitted.");
    assert.equal(item.scholarshipId, 2, "LogNameUpdated event 'scholarshipId' property not emitted.");
    assert.equal(item.scholarshipName, "UCV engineering", "LogNameUpdated event 'scholarshipName' property not emitted.");
    assert.equal(item.scholarshipBalance, 0, "LogNameUpdated event 'scholarshipBalance' property not emitted.");
    assert.equal(item.scholarshipNeed, 100, "LogNameUpdated event 'scholarshipNeed' property not emitted.");
  });

  it("should emit a LogNeedUpdated event when need of an existing scholarship is updated.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    const result = await cryptoScholarshipInstance.updateScholarshipNeed(2, 500, { from: accounts[0] });
    const item =  result.logs[0].args;
    assert.equal(item.message, "Scholarship Need Successfully Updated", "LogNeedUpdated event 'message' property not emitted.");
    assert.equal(item.scholarshipId, 2, "LogNeedUpdated event 'scholarshipId' property not emitted.");
    assert.equal(item.scholarshipName, "UCV engineering", "LogNeedUpdated event 'scholarshipName' property not emitted.");
    assert.equal(item.scholarshipBalance, 0, "LogNeedUpdated event 'scholarshipBalance' property not emitted.");
    assert.equal(item.scholarshipNeed, 600, "LogNeedUpdated event 'scholarshipNeed' property not emitted.");
  });

  it("should emit a LogDonation event when donation is sent to an existing scholarship.", async () => {
    const cryptoScholarshipInstance = await CryptoScholarship.deployed();
    const result = await cryptoScholarshipInstance.sendDonation(2, { from: accounts[0], value: 200});
    const item =  result.logs[0].args;
    assert.equal(item.message, "Donation Successful", "LogDonation event 'message' property not emitted.");
    assert.equal(item.scholarshipId, 2, "LogDonation event 'scholarshipId' property not emitted.");
    assert.equal(item.scholarshipName, "UCV engineering", "LogDonation event 'scholarshipName' property not emitted.");
    assert.equal(item.scholarshipBalance, 200, "LogDonation event 'scholarshipBalance' property not emitted.");
    assert.equal(item.scholarshipNeed, 400, "LogDonation event 'scholarshipNeed' property not emitted.");
  });
});
