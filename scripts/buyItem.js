const { ethers, network } = require("hardhat")
const { moveBlocks, sleep } = require("../utils/move-blocks")
const tokenId = 15

async function buyItem() {
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNft")

    const getListing = await nftMarketPlace.getListing(basicNft.address, tokenId)
    const price = getListing.price.toString()

    console.log(price)
    const tx = await nftMarketPlace.buyItem(basicNft.address, tokenId, { value: price })
    await tx.wait(1)
    console.log(`Bought NFT`)

    //if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000))
    //}
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
