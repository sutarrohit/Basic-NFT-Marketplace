const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { devlopmentChains } = require("../../helper-hardhat-config")

!devlopmentChains.includes(devlopmentChains.name)
    ? describe.skip
    : describe("Testing NftMarketPlace", function () {
          let nftMarketPlace, basicNft, deployer, player
          const PRICE = ethers.utils.parseEther("0,01")
          const TOKEN_ID = 0

          beforeEach(async function () {
              deployer = await getNamedAccounts().deployer
              //   player = await getNamedAccounts().player
              const accounts = await ethers.getSigners()
              player = accounts[1]

              await deployments.fixture(["all"])
              nftMarketPlace = await ethers.getContract("NftMarketPlace")
              basicNft = await ethers.getContract("BasicNft")

              await basicNft.mintNft()
              await basicNft.approve(nftMarketPlace, TOKEN_ID)
          })

          it("lsit NFT om the marketplace", async () => {
              await nftMarketPlace.listNft(basicNft.address, TOKEN_ID, PRICE)
              const playerConnectToMarketPlace = await nftMarketPlace.connect(player)
              await playerConnectToMarketPlace.buyItem(basicNft.address, TOKEN_ID)
              const newOwner = await basicNft.ownerOf(TOKEN_ID)
              const deployProcceds = await nftMarketPlace.getProccds(deployer)

              assert.equal(TOKEN_ID, 0)
              assert(newOwner.toString() == player.address)
              assert(deployProcceds.toString() == PRICE.toString())
          })
      })
