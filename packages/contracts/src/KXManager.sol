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
    mapping(uint256 => uint256[]) private listingToSessionIds;
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
            string memory dataCID_,
            uint256 listingIndex_
        ) = abi.decode(report, (address, address, uint256, string, uint256));

        uint256 sessionId = sessionRegistry.registerSessionAsManager(
            teacher_,
            learner_,
            amount_,
            dataCID_
        );
        listingToSessionIds[listingIndex_].push(sessionId);
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

    function getListingsCount() external view returns (uint256) {
        return listings.length;
    }

    function getListing(uint256 index_) external view returns (Listing memory) {
        if (index_ >= listings.length) revert InvalidIndex();
        return listings[index_];
    }

    function getListings(
        uint256 offset_,
        uint256 limit_
    ) external view returns (Listing[] memory result) {
        uint256 total = listings.length;
        if (offset_ >= total || limit_ == 0) {
            return new Listing[](0);
        }

        uint256 end = offset_ + limit_;
        if (end > total) {
            end = total;
        }

        result = new Listing[](end - offset_);
        for (uint256 i = offset_; i < end; i++) {
            result[i - offset_] = listings[i];
        }
    }

    function getSessionIdsByListing(
        uint256 listingIndex_,
        uint256 offset_,
        uint256 limit_
    ) external view returns (uint256[] memory result) {
        if (listingIndex_ >= listings.length) revert InvalidIndex();

        uint256[] storage sessionIds = listingToSessionIds[listingIndex_];
        uint256 total = sessionIds.length;
        if (offset_ >= total || limit_ == 0) {
            return new uint256[](0);
        }

        uint256 end = offset_ + limit_;
        if (end > total) {
            end = total;
        }

        result = new uint256[](end - offset_);
        for (uint256 i = offset_; i < end; i++) {
            result[i - offset_] = sessionIds[i];
        }
    }
}
