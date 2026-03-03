// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ReceiverTemplate} from "./interfaces/ReceiverTemplate.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./KXSessionRegistry.sol";

contract KXManager is ReceiverTemplate {
    KXSessionRegistry public sessionRegistry;
    IERC20 public usdc;
    address private _server;

    error AmountZero();

    event SessionRegistered(
        address indexed teacher,
        address indexed learner,
        uint256 amount,
        string dataCID
    );
    event SessionRegistrationRequested(
        address indexed teacher,
        address indexed learner,
        uint256 amount,
        string partialDataCID
    );

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

    function requestSessionRegistration(
        address teacher_,
        address learner_,
        uint256 amount_,
        string memory partialDataCID_
    ) external {
        if (amount_ == 0) revert AmountZero();

        usdc.transferFrom(msg.sender, address(sessionRegistry), amount_);

        emit SessionRegistrationRequested(
            teacher_,
            learner_,
            amount_,
            partialDataCID_
        );
    }
}
