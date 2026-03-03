// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReceiverTemplate} from "./interfaces/ReceiverTemplate.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KX is ERC20 {
    constructor() ERC20("KX payment", "KX") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
