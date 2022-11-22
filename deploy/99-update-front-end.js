const { ethers, network } = require("hardhat")
require("dotenv").config()
const fs = require("fs")

const UPDATE_FRONT_END = process.env.UPDATE_FRONT_END

//Path of the frontend file
const frontEndContractFile =
    "C:/Users/91976/Desktop/Blockchain/BLockchain_2.0/FreeCodeCamp/Full-Stack-NFT/ForentEnd-Moralis-NextJS/full-stack-nft/constants/networkMapping.json"

//Path for abi file location
const forntEndAbiLoaction =
    "C:/Users/91976/Desktop/Blockchain/BLockchain_2.0/FreeCodeCamp/Full-Stack-NFT/ForentEnd-Moralis-NextJS/full-stack-nft/constants/"

module.exports = async function () {
    if (UPDATE_FRONT_END) {
        console.log(UPDATE_FRONT_END)
        await updateContractAddress()
        await updateAbi()
    }
}

//Update contract abi on front end
async function updateAbi() {
    //Here we get abi file and write down in front end
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    fs.writeFileSync(
        `${forntEndAbiLoaction}NftMarketPlace.json`,
        nftMarketPlace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${forntEndAbiLoaction}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

//Updat contract address on front end
async function updateContractAddress() {
    const nftMarketPlace = await ethers.getContract("NftMarketPlace")
    //const chainId = network.config.chainId.toString()
    const chainId = 31337

    //Read data from frontend file
    const contractAddress = JSON.parse(fs.readFileSync(frontEndContractFile, "utf8"))

    if (!contractAddress[chainId]["NftMarketPlace"].includes(nftMarketPlace.address)) {
        contractAddress[chainId]["NftMarketPlace"].push(nftMarketPlace.address)
    } else {
        //Write back data into the file
        contractAddress[chainId] = { NftMarketPlace: [nftMarketPlace.address] }
    }
    fs.writeFileSync(frontEndContractFile, JSON.stringify(contractAddress))
}

//module.exports.tags = ["all", "frontend"]
