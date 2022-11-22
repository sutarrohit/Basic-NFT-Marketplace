const { moveBlocks, sleep } = require("../utils/move-blocks")

async function moveBlock() {
    const Block = 2
    const Time = 1

    await moveBlocks(1, (sleepAmount = 1000))
}

moveBlock()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
