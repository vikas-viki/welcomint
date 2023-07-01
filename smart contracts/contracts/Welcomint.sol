// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Welcomint is ERC721, ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    constructor() ERC721("Welcomint", "WMT") {}

    struct Listing {
        address seller;
        uint256 price;
        bool active;
        string tokenUri;
    }

    mapping(uint256 => Listing) private listings;

    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event NFTSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    // For users if they don't want to sale, like they just want to mint.
    function safeMint(string memory _tokenURI) public {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        listings[newTokenId] = Listing({
            seller: msg.sender,
            price: 0,
            active: false,
            tokenUri: _tokenURI
        });
    }

    // Used to list the nft for sale of a user, initially when minted..
    function listNFT(uint256 price, string memory _tokenURI) external {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        listings[newTokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true,
            tokenUri: _tokenURI
        });
        emit NFTListed(newTokenId, msg.sender, price);
    }

    // For the users to list for sale the minted nft.
    function listForSale(uint tokenId, uint _price) external {
        Listing storage listing = listings[tokenId];
        require(listing.seller == msg.sender, "Only owner can list NFTs");
        listing.active = true;
        listing.price = _price;
        listings[tokenId] = listing;
    }

    // For users to calncel the list for sale.
    function cancelListing(uint tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.seller == msg.sender, "Only owner can cancel listing");
        listing.active = false;
        listings[tokenId] = listing;
    }

    // For the users to buy NFT
    function buyNFT(uint256 tokenId) external payable {
        Listing storage listing = listings[tokenId];
        require(listing.active, "NFT not available for sale");
        require(msg.value >= listing.price, "Insufficient funds");

        address seller = listing.seller;
        listing.active = false;
        listings[tokenId] = listing;
        _transfer(seller, msg.sender, tokenId);

        emit NFTSold(tokenId, seller, msg.sender, listing.price);

        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getTokensByOwner(address owner)
        public
        view
        returns (string[] memory)
    {
        uint256 tokenCount = balanceOf(owner);
        string[] memory tokens = new string[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = tokenURI(tokenOfOwnerByIndex(owner, i));
        }

        return tokens;
    }
}
