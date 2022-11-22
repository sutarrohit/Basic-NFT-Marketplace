//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//`listItem`: List NFT on the marketplace
//`buyItem` : Buy NFT on the marketplace
//`cancelIteam` : cancle listing of NFT
//`updatelisting` : update listing data of the NFT
//`withdrawprocessed` : withdraw mony from marketplace

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//error functions
error NftMarketPlace_PriceMustBeAboveZero();
error NftMarketPlace_NotApprovedForMarketPlace();
error NftMarketPlace_AlreadyListed(address nftContractAddress, uint256 tokenId);
error NftMarketPlace_NotOwner();
error NftMarketPlace_NftNotListed(address nftContractAddress, uint256 tokenId);
error NftMarketPlace_PriceNotMet(address nftContractAddress, uint256 tokenId, uint256 price);
error NftMarketPlace_NoProceed();
error NftMarketPlace_TransactionFailed();

contract NftMarketPlace is ReentrancyGuard {
    /**Structs*/
    struct Listing {
        uint256 price;
        address seller;
    }

    /**Mappings*/
    /**NFT contract mapping => tokenID => Listing struct*/
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    //Mapping bet seller's address and Amount earned
    mapping(address => uint256) private s_proceeds;
    uint256 test;

    //**Events */
    event itemListed(
        address indexed seller,
        address indexed nftContractAddress,
        uint256 indexed tokensId,
        uint256 price
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event ItemCanceled(address indexed seller, address indexed NftContractAddress, uint256 tokenId);

    //**Modifiers*/

    //**Checking if NFT is already listed or not  */
    modifier notListed(
        address nftContractAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftContractAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketPlace_AlreadyListed(nftContractAddress, tokenId);
        }
        _;
    }

    //**Checking the Owner of the NFT is msg.sender or not */
    modifier isOwner(
        address nftContractAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftContractAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NftMarketPlace_NotOwner();
        }
        _;
    }

    //**Checking if the NFT is listed or not */
    modifier isListed(address nftContractAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftContractAddress][tokenId];

        if (listing.price <= 0) {
            revert NftMarketPlace_NftNotListed(nftContractAddress, tokenId);
        }

        _;
    }

    ////////Main Functions////////

    /**
     * @dev listNft() is used to list NFTs on the markeplace
     * @param nftContractAddress address of the NFT contract
     * @param tokenId token number of the NFT
     * @param price set price of the NFT
     * @notice The list NFT function is gonna list NFT on the MarketPlace, user still hold NFT and give the marketplace approval to sell the NFT for them
     */
    function listNft(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftContractAddress, tokenId, msg.sender)
        isOwner(nftContractAddress, tokenId, msg.sender)
    {
        if (price <= 0) {
            revert NftMarketPlace_PriceMustBeAboveZero();
        }

        //Checking if contract approve to marketplace
        IERC721 nft = IERC721(nftContractAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketPlace_NotApprovedForMarketPlace();
        }

        //mapping listing NFT details
        s_listings[nftContractAddress][tokenId] = Listing(price, msg.sender);
        emit itemListed(msg.sender, nftContractAddress, tokenId, price);
    }

    /**
     * @dev This function is used to buy NFTs
     * @param nftContractAddress address of the NFT contract
     * @param tokenId token number of the NFT
     * @notice When buyer buy NFT with paying correct amount this function safe transfer that NFT and add Amount to the seller's address
     */
    function buyItem(address nftContractAddress, uint256 tokenId)
        external
        payable
        isListed(nftContractAddress, tokenId)
    {
        Listing memory listedItem = s_listings[nftContractAddress][tokenId];

        //Revert transation when correct amount is not send
        if (msg.value < listedItem.price) {
            revert NftMarketPlace_PriceNotMet(nftContractAddress, tokenId, listedItem.price);
        }

        //mapping seller => amount
        s_proceeds[listedItem.seller] = s_proceeds[listedItem.seller] + msg.value;
        //Delete listing after selling NFT
        delete (s_listings[nftContractAddress][tokenId]);

        //Transfer toke to buyer
        IERC721(nftContractAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);

        //make sure NFT was transferred
        emit ItemBought(msg.sender, nftContractAddress, tokenId, listedItem.price);
    }

    /**This function cancle NFT listing  */

    function cancleListing(address nftContractAddress, uint256 tokenId)
        external
        isOwner(nftContractAddress, tokenId, msg.sender)
        isListed(nftContractAddress, tokenId)
    {
        delete (s_listings[nftContractAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftContractAddress, tokenId);
    }

    /**This function update listed NFT price */
    function updateListing(
        address nftContractAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isOwner(nftContractAddress, tokenId, msg.sender)
        isListed(nftContractAddress, tokenId)
    {
        s_listings[nftContractAddress][tokenId].price = newPrice;
        emit itemListed(msg.sender, nftContractAddress, tokenId, newPrice);
    }

    /**This function withdraw Amount to seller's address */
    function withdrawProceeds() external nonReentrant {
        uint256 proceeds = s_proceeds[msg.sender];

        if (proceeds <= 0) {
            revert NftMarketPlace_NoProceed();
        }

        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) {
            revert NftMarketPlace_TransactionFailed();
        }
    }

    ////////Getter Functions////////

    function getListing(address NftContractAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[NftContractAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }
}
