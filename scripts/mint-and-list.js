const { ethers, getNamedAccounts, network } = require("hardhat")
const { moveBlocks, sleep } = require("../utils/move-blocks")

async function mintAndList() {
    const { deployer } = await getNamedAccounts()
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNft")
    console.log(nftMarketPlace.address, basicNft.address)
    const price = ethers.utils.parseEther("0.01")

    //Minting NFTclear
    console.log("*******************************************************************")
    console.log("Minting NFT........")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = await mintTxReceipt.events[0].args.tokenId
    console.log("NFT Minted, TokenId is ", tokenId.toString())
    //Approving NFT
    const approveNft = await basicNft.approve(nftMarketPlace.address, tokenId)
    await approveNft.wait(1)
    console.log("*******************************************************************")

    //Listing NFT on Marketplace
    const listNft = await nftMarketPlace.listNft(basicNft.address, tokenId, price)
    console.log(`NFT Listed`)

    //Move blockes

    //if (network.config.chainId == "31337") {
    await moveBlocks(1, (sleepAmount = 1000))
    //}
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
