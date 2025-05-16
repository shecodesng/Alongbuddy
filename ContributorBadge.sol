// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ContributorBadge is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor(address initialOwner) ERC721("ContributorBadge", "CB") Ownable(initialOwner) {
        nextTokenId = 1;
    }

    function mint(address to, string memory uri) external onlyOwner {
        _safeMint(to, nextTokenId);
        _setTokenURI(nextTokenId, uri);
        nextTokenId++;
    }
}

