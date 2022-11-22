const { ethers, getNamedAccounts, network } = require("hardhat")
const { moveBlocks, sleep } = require("../utils/move-blocks")

async function mint() {
    const { deployer } = await getNamedAccounts()

    const basicNft = await ethers.getContract("BasicNft")

    //Minting NFTclear
    console.log("*******************************************************************")
    console.log("Minting NFT........")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = await mintTxReceipt.events[0].args.tokenId
    console.log("NFT Minted, TokenId is ", tokenId.toString())
    console.log("Contract Address ", basicNft.address)

    //if (network.config.chainId == "31337") {
    await moveBlocks(1, (sleepAmount = 1000))
    //}
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
