// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SplitWiseGroup {
    // Enum to represent member status
    enum MemberStatus { Inactive, Active }

    // Contract owner's address
    address public owner;

    // The required amount to join the group
    uint256 public requiredAmount;

    // Mapping to store member status (Active or Inactive)
    mapping(address => MemberStatus) public members;

    // Array to store active member addresses
    address[] public activeMembers;

    // Mapping to store stakes (amount sent by each member)
    mapping(address => uint256) public stakes;

    // Boolean flag to indicate if the group has been settled
    bool public isSettled;

    // Struct to represent an expense
    struct Expense {
        address payer;                   // Address of the member who paid the expense
        string name;                     // Name of the expense
        uint256 amount;                  // Total expense amount
        address[] creditor_addresses;
    }

    // Array to store expenses
    mapping (uint256 => Expense) public expenses;

    uint256 public expensesLength;

    // Event to log when an expense is added
    event ExpenseAdded(uint256 expenseIndex, address payer, uint256 amount, string name, address[] creditor_addresses);


    // Constructor to initialize the contract with required amount and initial members
    constructor(uint256 _requiredAmount, address[] memory _members, address _owner) payable {
        require(_members.length > 0, "At least one member is required");
        require(msg.sender.balance >= _requiredAmount, "Insufficient balance");

        // Set the contract owner to the address deploying the contract
        owner = _owner;

        // Set the required amount to join the group
        requiredAmount = _requiredAmount;

        // Initialize the group as unsettled
        isSettled = false;

        // Initialize the expensesLength to 0
        expensesLength = 0;

        // Initialize members with the provided addresses as Inactive
        for (uint256 i = 0; i < _members.length; i++) {
            members[_members[i]] = MemberStatus.Inactive;
        }
        members[msg.sender] = MemberStatus.Active;
        activeMembers.push(msg.sender);
    }

    // Modifier to ensure only the contract owner can call a function
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Modifier to ensure only active members can call a function
    modifier onlyMember() {
        require(isMember(msg.sender), "Only members can call this function");
        _;
    }

    // Modifier to ensure the group is open (not settled)
    modifier isOpen() {
        require(!isSettled, "The group is closed");
        _;
    }

    // Modifier to ensure only active members can call functions related to expenses
    modifier onlyActiveMember() {
        require(isMember(msg.sender), "Only active members can call this function");
        _;
    }

    // Check if an address is an active member
    function isMember(address member) public view returns (bool) {
        return members[member] == MemberStatus.Active;
    }

    // Check if an address is in the whitelist (Inactive member)
    function isWhitelisted(address member) public view returns (bool) {
        return members[member] == MemberStatus.Inactive;
    }

    // Add addresses to the whitelist (set as Inactive members)
    function addToWhitelist(address[] calldata newMembers) external onlyOwner isOpen {
        for (uint256 i = 0; i < newMembers.length; i++) {
            members[newMembers[i]] = MemberStatus.Inactive;
        }
    }

    // Remove addresses from the whitelist
    function removeFromWhitelist(address[] calldata membersToRemove) external onlyOwner isOpen {
        for (uint256 i = 0; i < membersToRemove.length; i++) {
            // Ensure the member is in the whitelist before removing
            require(members[membersToRemove[i]] == MemberStatus.Inactive, "Member is not in whitelist");
            require(members[membersToRemove[i]] != MemberStatus.Active, "Cannot remove active members");
            delete members[membersToRemove[i]];
        }
    }

    // Allow new members to join the group by sending the required amount
    function join() external payable isOpen {
        // Ensure the sender is not already an active member
        require(!isMember(msg.sender), "You are already a member");

        // Ensure the sender is in the whitelist
        require(isWhitelisted(msg.sender), "You are not whitelisted");

        // Ensure the sent amount matches the required amount
        require(msg.value == requiredAmount, "You must send the required amount to join");

        // Set the sender as an active member and record their stake
        members[msg.sender] = MemberStatus.Active;
        stakes[msg.sender] = msg.value;
        activeMembers.push(msg.sender);
    }

    // Settle the group by distributing the balance among active members
    function settleGroup() external onlyOwner isOpen {
        // Calculate the total balance of the contract
        uint256 totalBalance = address(this).balance;

        // Distribute the balance evenly among active members
        for (uint256 i = 0; i < activeMembers.length; i++) {
            address member = getActiveMember(i);
            uint256 share = totalBalance / activeMembers.length;

            // Transfer the share to the active member
            payable(member).transfer(share);
        }
        // Mark the group as settled
        isSettled = true;
    }

    // Remove an active member from the group
    function removeMember(address memberToRemove) external onlyOwner isOpen {
        // Ensure the address is an active member
        require(isMember(memberToRemove), "The address is not a member");

        // Ensure the owner cannot be removed
        require(memberToRemove != owner, "The owner cannot be removed");

        // Delete the member's stake and status
        delete stakes[memberToRemove];
        delete members[memberToRemove];

        // Remove the member from the activeMembers array
        for (uint256 i = 0; i < activeMembers.length; i++) {
            if (activeMembers[i] == memberToRemove) {
                activeMembers[i] = activeMembers[activeMembers.length - 1];
                activeMembers.pop();
                break;
            }
        }
    }

    function getActiveMembers() public view returns (address[] memory) {
        return activeMembers;
    }

    // Get the address of an active member by index
    function getActiveMember(uint256 index) public view returns (address) {
        require(index < activeMembers.length, "Member not found");
        return activeMembers[index];
    }

    // Count the number of active members
    function getActiveMembersCount() public view returns (uint256) {
        return activeMembers.length;
    }

    // Allow the owner to send Ether from the contract to a recipient
    function send(uint256 amount, address recipient) external onlyOwner isOpen payable {
        // Ensure the contract has sufficient balance
        require(amount <= address(this).balance, "Insufficient balance");

        // Ensure the recipient address is valid
        require(recipient != address(0), "Invalid recipient address");

        // Transfer the specified amount to the recipient
        payable(recipient).transfer(amount);
    }

    // Add an expense to be split among specified creditors
    function addExpense(address _payer, string memory _name, address[] calldata _creditor_addresses, uint256 _amount) external onlyOwner isOpen {
        require(bytes(_name).length > 0, "Expense name cannot be empty");
        require(_amount > 0, "Expense amount must be greater than 0");
        require(_creditor_addresses.length > 0, "At least one creditor is required");
        require(isMember(_payer), "Payer is not a member");
        // TODO: ensure that _creditor_addresses are members

        // Create a new expense
        Expense memory newExpense = Expense({
            payer : _payer,
            name : _name,
            amount : _amount,
            creditor_addresses : _creditor_addresses
        });

        // Add the expense to the expenses mapping
        expenses[expensesLength] = newExpense;

        expensesLength++;

        // Emit an event to log the expense
        emit ExpenseAdded(expensesLength, _payer, _amount, _name, _creditor_addresses);
    }

    // Get expense by index
    function getExpense(uint256 index) public view returns (Expense memory) {
        require(index < expensesLength, "Expense not found");
        return expenses[index];
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
