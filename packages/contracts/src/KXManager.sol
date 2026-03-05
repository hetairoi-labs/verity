// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ReceiverTemplate} from "./interfaces/ReceiverTemplate.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./KXSessionRegistry.sol";

contract KXManager is ReceiverTemplate {
    struct Listing {
        address teacher;
        uint256 price;
        string dataCID;
    }

    KXSessionRegistry public sessionRegistry;
    IERC20 public usdc;
    Listing[] public listings;
    address private _server;

    error AmountZero();
    error NotLearner();
    error NotListingOwner();
    error InvalidIndex();

    event SessionRegistrationRequested(
        address indexed teacher,
        address indexed learner,
        uint256 amount,
        string meetingLink,
        uint256 listingIndex
    );
    event SessionRegistered(
        address indexed teacher,
        address indexed learner,
        string dataCID
    );

    event ListingUpsert(uint256 index, string dataCID);

    constructor(
        address usdc_,
        address forwarder_
    ) ReceiverTemplate(forwarder_) {
        usdc = IERC20(usdc_);
        sessionRegistry = new KXSessionRegistry(address(this), forwarder_);
        _server = msg.sender;
    }

    function _processReport(bytes calldata report) internal override {
        (
            address teacher_,
            address learner_,
            uint256 amount_,
            string memory dataCID_
        ) = abi.decode(report, (address, address, uint256, string));

        sessionRegistry.registerSessionAsManager(
            teacher_,
            learner_,
            amount_,
            dataCID_
        );
    }

    function createListing(string memory dataCID_, uint256 price_) external {
        Listing memory newListing = Listing({
            teacher: msg.sender,
            price: price_,
            dataCID: dataCID_
        });
        listings.push(newListing);
        emit ListingUpsert(listings.length - 1, dataCID_);
    }

    function updateListing(
        uint256 index_,
        string memory dataCID_,
        uint256 price_
    ) external {
        if (index_ >= listings.length) revert InvalidIndex();
        Listing storage listing = listings[index_];
        if (listing.teacher != msg.sender) revert NotListingOwner();

        listing.dataCID = dataCID_;
        listing.price = price_;
        emit ListingUpsert(index_, dataCID_);
    }

    function requestSessionRegistration(
        uint256 listingIndex_,
        string calldata meetingLink_
    ) external {
        if (listingIndex_ >= listings.length) revert InvalidIndex();
        Listing memory listing = listings[listingIndex_];

        if (listing.price == 0) revert AmountZero();

        usdc.transferFrom(msg.sender, address(sessionRegistry), listing.price);

        emit SessionRegistrationRequested(
            listing.teacher,
            msg.sender,
            listing.price,
            meetingLink_,
            listingIndex_
        );
    }
}
