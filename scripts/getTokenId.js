const { ethers, getNamedAccounts, network } = require("hardhat")
const { moveBlocks, sleep } = require("../utils/move-blocks")

async function getTokenId() {
    const { deployer } = await getNamedAccounts()
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    const basicNft = await ethers.getContract("BasicNft")

    const tokenId = await basicNft.tokenURI(1)
    console.log(tokenId)
}

getTokenId()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
