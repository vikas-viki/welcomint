const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-ethers");

describe('Welcomint', function () {
  let welcomint;
  let owner;
  let acc2;

  before(async function () {

    [owner, acc1, acc2] = await ethers.getSigners();

    const WELCOMINT = await ethers.getContractFactory("Welcomint");
    welcomint = await WELCOMINT.deploy();

  });

  describe('Deployment', function () {
    it('Should set the right name and symbol', async function () {
      expect(await welcomint.name()).to.equal('Welcomint');
      expect(await welcomint.symbol()).to.equal('WMT');
    });
  });

  describe('Mint and list For Sale', function () {
    it('should mint new NFTs', async () => {
      await welcomint.safeMint('https://token-uri-1');
      expect(await welcomint.tokenURI(1)).to.equal('https://token-uri-1');

      await welcomint.safeMint('https://token-uri-2');
      expect(await welcomint.tokenURI(2)).to.equal('https://token-uri-2');

      const tenEth = await ethers.parseEther('10');
      await welcomint.listNFT(tenEth, 'https://token-uri-3');
      expect(await welcomint.tokenURI(3)).to.equal('https://token-uri-3');
    });
  });

  describe('ListForSale', function () {
    it('should fail to list NFT with invalid token id', async () => {
      const tokenId = 100;
      const price = ethers.parseEther('1');

      await expect(welcomint.listForSale(tokenId, price)).to.be.revertedWith('Invalid token id');
    });

    it('should fail to list NFT with zero price', async () => {
      const tokenId = 1;
      const price = ethers.parseEther('0');

      await expect(welcomint.listForSale(tokenId, price)).to.be.revertedWith('Price must be greater than 0');
    });

    it('should fail to list NFT if not the minted owner', async () => {
      const tokenId = 1;
      const price = ethers.parseEther('1');

      await expect(welcomint.connect(acc2).listForSale(tokenId, price)).to.be.revertedWith('Only minted owner can list NFTs');
    });

    
    it('should allow listing the minted NFT for sale', async () => {
      const tokenId = 1;
      const price = ethers.parseEther('10');

      await welcomint.listForSale(tokenId, price);
      const _tokens = await welcomint.getTokensByOwner(owner.address);
      expect(_tokens[0]).to.equal('https://token-uri-1'); 
    });

    it('should not allow re-listing the already listed NFT for sale', async () => {
      const tokenId = 1;
      const price = ethers.parseEther('10');

      await expect(welcomint.listForSale(tokenId, price)).to.be.revertedWith('token is already listed for sale.');
    });

  });

  describe('Buying and re-list for sale.', () => {

    it('should fail to buy NFT if owner try to buy it.', async () => {
      const tokenId = 1;

      await expect(welcomint.buyNFT(tokenId)).to.be.revertedWith('Owner can\'t buy his own nfts.');
    });

    it('should fail to buy NFT if insufficient funds provided.', async () => {
      const tokenId = 1;
      const oneEth = ethers.parseEther('1');
      await expect(welcomint.connect(acc2).buyNFT(tokenId, { value: oneEth })).to.be.revertedWith('Insufficient funds');
    });

    it('should fail to buy NFT if it is not listed for sale.', async () => {
      const tokenId = 2;
      const oneEth = ethers.parseEther('1');
      await expect(welcomint.connect(acc2).buyNFT(tokenId, { value: oneEth })).to.be.revertedWith('NFT not available for sale');
    });

    it('allows for buying the nfts listed.', async () => {
      const tokenID = 1;
      const tenEth = ethers.parseEther('10');
      const buyerBalanceBefore = await ethers.provider.getBalance(acc2.address);

      await welcomint.connect(acc2).buyNFT(tokenID, { value: tenEth });
      const buyerBalanceAfter = await ethers.provider.getBalance(acc2.address);

      expect(buyerBalanceBefore > buyerBalanceAfter);
    });

    it('should allow allow the buyer to re-list the nft he bought.', async () => {
      const tokenID = 1;
      const fiveEth = ethers.parseEther('5');
      await welcomint.connect(acc2).listForSale(tokenID, fiveEth);
      const _tokens = await welcomint.getTokensByOwner(acc2.address);
      expect(_tokens[0]).to.equal('https://token-uri-1'); 
    })
  });

  describe('Cancel listing', function () {
    it('should revert if invalid token id is passed', async function () {
      await expect(welcomint.cancelListing(100)).to.be.revertedWith('Invalid token ID');
    });
    it('should allow only owner of NFTs to cancel listing.', async function () {
      await expect(welcomint.connect(acc2).cancelListing(2)).to.be.revertedWith('Only owner can cancel listing');
    });

    it('should allow owner to cancel the listing', async function () {
      await welcomint.connect(acc2).cancelListing(1);
      await expect(welcomint.buyNFT(1)).to.be.revertedWith('NFT not available for sale');
    })
  });
});

