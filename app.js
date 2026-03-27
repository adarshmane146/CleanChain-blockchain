
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// ----------- Block Definition -----------
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
    const blockContent = {
      index: this.index,
      timestamp: this.timestamp,
      data: this.data,
      previous_hash: this.previous_hash,
      nonce: this.nonce,
    };

    return crypto
      .createHash("sha256")
      .update(JSON.stringify(blockContent))
      .digest("hex");
  }
}

// ----------- Blockchain Class -----------
class Blockchain {
  constructor() {
    this.difficulty = 4;
    this.chain = this.loadChain();
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), { message: "Genesis Block" }, "0");
  }

  getLastBlock() {
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
    const previousBlock = this.getLastBlock();
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      data,
      previousBlock.hash
    );

    const minedBlock = this.proofOfWork(newBlock);
    this.chain.push(minedBlock);
    this.saveChain();
    return minedBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.computeHash()) return false;
      if (current.previous_hash !== previous.hash) return false;
      if (!current.hash.startsWith("0".repeat(this.difficulty))) return false;
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
    if (fs.existsSync("blockchain.json")) {
      const data = JSON.parse(fs.readFileSync("blockchain.json"));

      return data.map((entry) => {
        const block = new Block(
          entry.index,
          entry.timestamp,
          entry.data,
          entry.previous_hash,
          entry.nonce
        );
        block.hash = entry.hash;
        return block;
      });
    }

    return [this.createGenesisBlock()];
  }
}

const blockchain = new Blockchain();

// ----------- Utility Function -----------
function getPointsForAction(action) {
  const actionPoints = {
    "cleaned road": 10,
    "planted tree": 15,
    "recycled waste": 8,
    "helped elder": 12,
  };

  return actionPoints[action.toLowerCase()];
}

// ----------- Process Transaction -----------
function processTransaction(sender, action) {
  const points = getPointsForAction(action);

  if (!points) {
    return { status: "error", message: "Invalid action" };
  }

  blockchain.addBlock({ user: sender, action: action });

  let balances = {};

  if (fs.existsSync("balances.json")) {
    balances = JSON.parse(fs.readFileSync("balances.json"));
  }

  balances[sender] = (balances[sender] || 0) + points;

  fs.writeFileSync("balances.json", JSON.stringify(balances, null, 4));

  return {
    status: "success",
    message: `${sender} earned ${points} CLEAN-COINS`,
    balance: balances[sender],
  };
}

// ----------- API Routes -----------

// get blockchain
app.get("/chain", (req, res) => {
  res.json(blockchain.chain);
});

// new transaction
app.post("/new_transaction", (req, res) => {
  const { from, action } = req.body;

  if (!from || !action) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const result = processTransaction(from, action);
  res.json(result);
});

// balances
app.get("/balances", (req, res) => {
  if (fs.existsSync("balances.json")) {
    const balances = JSON.parse(fs.readFileSync("balances.json"));
    return res.json(balances);
  }

  res.json({});
});

// validate blockchain
app.get("/validate", (req, res) => {
  const valid = blockchain.isChainValid();

  res.json({
    message: valid
      ? "Blockchain is valid"
      : "Blockchain is NOT valid",
  });
});

// ----------- Start Server -----------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});