const { ethers, getNamedAccounts, network } = require("hardhat")
const { moveBlocks, sleep } = require("../utils/move-blocks")

const tokenId = 1

async function updateListing() {
    const { deployer } = await getNamedAccounts()
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNft")
    const price = ethers.utils.parseEther("2.1")

    const tx = await nftMarketPlace.updateListing(basicNft.address, tokenId, price)
    await tx.wait(1)

    console.log(`Listing of contract ${basicNft.address} and token ${tokenId} updated`)

    //if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000))
    //}
}

updateListing()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
