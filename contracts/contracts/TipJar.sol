// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TipJar {
    event TipSent(
        address indexed tipper,
        address indexed creator,
        address indexed token,
        uint256 amount,
        string postId
    );

    mapping(address => bool) public supportedTokens;
    address public owner;

    constructor(address[] memory initialTokens) {
        owner = msg.sender;
        for (uint256 i = 0; i < initialTokens.length; i++) {
            supportedTokens[initialTokens[i]] = true;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function setTokenSupport(address token, bool enabled) external onlyOwner {
        supportedTokens[token] = enabled;
    }

    function tip(
        address creator,
        address token,
        uint256 amount,
        string calldata postId
    ) external {
        require(creator != address(0), "invalid creator");
        require(amount > 0, "amount zero");
        require(supportedTokens[token], "token disabled");

        IERC20(token).transferFrom(msg.sender, creator, amount);
        emit TipSent(msg.sender, creator, token, amount, postId);
    }
}
