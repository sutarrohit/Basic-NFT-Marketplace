const { ethers } = require("hardhat")
const { moveBlocks, sleep } = require("../utils/move-blocks")

const tokenId = 0

async function cancleListing() {
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNft")
    const cancleListing = await nftMarketPlace.cancleListing(basicNft.address, tokenId)
    await cancleListing.wait(1)
    console.log(`NFT Listing Canceled`)

    //if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000))
    //}
}

cancleListing()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
