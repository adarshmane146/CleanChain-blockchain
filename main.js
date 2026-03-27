const fs = require("fs");
const Blockchain = require("./blockchain");
const { generateWallet, signMessage } = require("./wallet_utils");

// Create blockchain
const bc = new Blockchain();

// Create wallet
const wallet = generateWallet();
const privateKey = wallet.privateKey;

// Create message
const message = {
  user: "Adarsh",
  action: "cleaned the road"
};

// Generate signature
const signature = signMessage(privateKey, message);

// Add block
bc.addBlock({
  user: "Adarsh",
  action: "cleaned the road",
  signature: signature
});

// Check blockchain validity
console.log("Blockchain valid:", bc.isChainValid());

// Print blockchain
bc.chain.forEach((block) => {
  console.log(`\nBlock #${block.index}`);
  console.log("Timestamp:", block.timestamp);
  console.log("Data:", block.data);
  console.log("Previous Hash:", block.previous_hash);
  console.log("Hash:", block.hash);
});

// Print balances
console.log("\n--- User Balances ---");

try {
  const balances = JSON.parse(fs.readFileSync("balances.json"));

  for (const user in balances) {
    console.log(`${user}: ${balances[user]} CLEAN-COINs`);
  }
} catch {
  console.log("⚠️ No balances found.");
}


// -------- DASHBOARD --------
function displayDashboard(blockchain) {

  console.log("\n=== 🚀 BLOCKCHAIN DASHBOARD ===");

  blockchain.chain.forEach((block) => {

    console.log(`\n📦 Block #${block.index}`);
    console.log(`⏰ Timestamp     : ${block.timestamp}`);
    console.log(`📄 Data          :`, block.data);
    console.log(`🔗 Previous Hash : ${block.previous_hash}`);
    console.log(`🧾 Hash          : ${block.hash}`);

  });

  console.log("\n=== 💰 User Balances ===");

  try {
    const balances = JSON.parse(fs.readFileSync("balances.json"));

    for (const user in balances) {
      console.log(`👤 ${user}: ${balances[user]} CLEAN-COINs`);
    }

  } catch {
    console.log("⚠️ No balances found.");
  }

  console.log("\n✅ Blockchain valid:", blockchain.isChainValid());
}

// Show dashboard
displayDashboard(bc);