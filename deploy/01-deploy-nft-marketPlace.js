const { ethers, network } = require("hardhat")
const { devlopmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const args = []

    log("--------------------------------------------------------------------------")

    const NftMarketPlaceContract = await deploy("NftMarketPlace", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockconfirmations || 1,
    })

    console.log("Contract Name", NftMarketPlaceContract.contractName)
    console.log("Constract address", NftMarketPlaceContract.address)

    if (!devlopmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifying......")
        await verify(NftMarketPlaceContract.address, args)
    }
}

module.exports.tags = ["NftMarketPlaceContract", "all"]

//basic NFT : 0xf65Fd3f6aff92cB863246C7Dcb8a6189FA8844a6
//NftMarketPlaceContract :0xe95735A238A5523e972EcB19BfdD54d3728d61a9
