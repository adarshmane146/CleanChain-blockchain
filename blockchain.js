const crypto = require("crypto");
const fs = require("fs");

const { verifySignature } = require("./wallet_utils");

class Block {
  constructor(index, timestamp, data, previous_hash, nonce = 0) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previous_hash = previous_hash;
    this.nonce = nonce;
    this.hash = this.computeHash();
  }

  computeHash() {
    const blockString = JSON.stringify({
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      previous_hash: this.previous_hash,
      nonce: this.nonce
    });

    return crypto.createHash("sha256").update(blockString).digest("hex");
  }
}

class Blockchain {

  constructor() {
    this.difficulty = 4;
    this.chain = this.loadChain();
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), { message: "Genesis Block" }, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(block) {
    while (!block.hash.startsWith("0".repeat(this.difficulty))) {
      block.nonce++;
      block.hash = block.computeHash();
    }
    return block;
  }

  addBlock(data) {

    if (!data.signature) {
      throw new Error("Transaction must include a signature!");
    }

    const previousBlock = this.getLatestBlock();

    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      data,
      previousBlock.hash
    );

    const minedBlock = this.proofOfWork(newBlock);

    this.chain.push(minedBlock);

    this.saveChain();

    this.rewardUser(data.user || "Unknown", data.action || "");

    return minedBlock;
  }

  isChainValid() {

    for (let i = 1; i < this.chain.length; i++) {

      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.computeHash()) {
        console.log("Invalid hash at block", i);
        return false;
      }

      if (current.previous_hash !== previous.hash) {
        console.log("Previous hash mismatch");
        return false;
      }

      if (!current.hash.startsWith("0".repeat(this.difficulty))) {
        console.log("Proof-of-work invalid");
        return false;
      }

      if (current.data.signature) {

        let wallets;

        try {
          wallets = JSON.parse(fs.readFileSync("wallets.json"));
        } catch {
          console.log("wallets.json not found");
          return false;
        }

        const user = current.data.user;
        const action = current.data.action;
        const signature = current.data.signature;

        if (!wallets[user]) {
          console.log("No wallet for user", user);
          return false;
        }

        // 🔥 FIX HERE
        const pubKey = wallets[user].public;

        const message = {
          user: user,
          action: action
        };

        const valid = verifySignature(pubKey, signature, message);

        if (!valid) {
          console.log("Invalid signature");
          return false;
        }
      }
    }

    return true;
  }

  saveChain() {
    fs.writeFileSync(
      "blockchain.json",
      JSON.stringify(this.chain, null, 4)
    );
  }

  loadChain() {

    if (!fs.existsSync("blockchain.json")) {
      return [this.createGenesisBlock()];
    }

    try {

      const data = JSON.parse(fs.readFileSync("blockchain.json"));

      return data.map(blockData => {

        const block = new Block(
          blockData.index,
          blockData.timestamp,
          blockData.data,
          blockData.previous_hash,
          blockData.nonce
        );

        block.hash = blockData.hash;

        return block;
      });

    } catch {
      return [this.createGenesisBlock()];
    }
  }

  rewardUser(user, action) {

    const reward = getPointsForAction(action);

    let balances = {};

    try {
      balances = JSON.parse(fs.readFileSync("balances.json"));
    } catch {
      balances = {};
    }

    balances[user] = (balances[user] || 0) + reward;

    fs.writeFileSync(
      "balances.json",
      JSON.stringify(balances, null, 4)
    );
  }
}

function getPointsForAction(action) {

  action = action.toLowerCase();

  if (action.includes("clean")) return 10;
  if (action.includes("study")) return 5;
  if (action.includes("help") || action.includes("volunteer")) return 8;
  if (action.includes("job") || action.includes("resume")) return 6;

  return 1;
}

module.exports = Blockchain;