// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract testUSDC is ERC20 {
    constructor(uint256 initialSupply_) ERC20("USD Coin", "USDC") {
        _mint(msg.sender, initialSupply_);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
