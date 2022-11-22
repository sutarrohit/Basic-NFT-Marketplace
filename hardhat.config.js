require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
require("solidity-coverage")

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY
const GOERLI_PRIVATE_KEY_2 = process.env.GOERLI_PRIVATE_KEY_2

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.17",

    defaultNetwork: "hardhat",

    networks: {
        hardhat: {
            chainId: 31337,
            blockconfirmations: 1,
        },

        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY, GOERLI_PRIVATE_KEY_2],
            chainId: 5,
            blockconfirmations: 4,
        },

        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockconfirmations: 4,
        },
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            5: 1,
        },
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },

    gasReporter: {
        enabled: false,
    },

    mocha: {
        timeout: 200000, // 200sec
    },
}
