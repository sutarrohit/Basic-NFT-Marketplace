const { ethers, network } = require("hardhat")
const { devlopmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------------------------------------------")

    const args = []
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockconfirmations || 1,
    })

    console.log(`contract deployed : ${basicNft.address} || deployer : ${deployer}`)

    if (!devlopmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying......")
        await verify(basicNft.address, args)
    }

    log("--------------------------------------------------------------------------")
}

module.exports.tags = ["all", "basicnft", "main"]

//Basis NFT : 0xeDC87c875B85f5677235c2bF8D5176Ee8660e7EF
//MarketPlace :0x1997897E41c42168EBf7e6Ec63DFF8F2B0f6947f
