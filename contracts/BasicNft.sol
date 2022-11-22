//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    uint256 s_tokenCounter;
    string public token_URI =
        "https://gateway.pinata.cloud/ipfs/QmZngW8U95hj1m4QXPT7FWCu98CeZZ16Pr9MXQCVvVemxG";

    constructor() ERC721("Dogie", "DOG") {
        s_tokenCounter = 0;
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
        return s_tokenCounter;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return token_URI;
    }

    function URI() public view returns (string memory) {
        return token_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
