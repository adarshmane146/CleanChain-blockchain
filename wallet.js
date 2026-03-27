
const fs = require("fs");
const readline = require("readline");
const { generateWallet } = require("./crypto_utils"); // or "./walletUtils" if you placed it there

const BALANCE_FILE = "balances.json";

// -------- Load Balances --------
function loadBalances() {
  if (!fs.existsSync(BALANCE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(BALANCE_FILE));
  } catch {
    return {};
  }
}

// -------- View Balance --------
function viewBalance(userPubKey) {
  const balances = loadBalances();
  return balances[userPubKey] || 0;
}

// -------- Show All Balances --------
function showAllBalances() {
  const balances = loadBalances();

  if (Object.keys(balances).length === 0) {
    console.log("No balances found.");
    return;
  }

  console.log("\nUser Balances:");
  for (const user in balances) {
    console.log(`- ${user.slice(0, 20)}... : ${balances[user]} CLEAN-COINS`);
  }
}

// -------- Leaderboard --------
function showLeaderboard(topN = 5) {
  const balances = loadBalances();

  const sorted = Object.entries(balances)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  console.log(`\n🏆 Top ${topN} Contributors:`);

  sorted.forEach(([user, coins], index) => {
    console.log(`${index + 1}. ${user.slice(0, 20)}... - ${coins} CLEAN-COINS`);
  });
}

// -------- Create Wallet --------
function createWallet() {
  const { privateKey, publicKey } = generateWallet();

  fs.writeFileSync("private.pem", privateKey);
  fs.writeFileSync("public.pem", publicKey);

  console.log("\n✅ Wallet created successfully!");
  console.log("Your keys are saved as private.pem & public.pem");
  console.log("Public Key (use this to receive CLEAN-COINS):\n");
  console.log(publicKey);
}

// -------- CLI Menu --------
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log("\n=== CLEAN-CHAIN Wallet Menu ===");
  console.log("1. Create New Wallet");
  console.log("2. View My Balance");
  console.log("3. Show All Balances");
  console.log("4. Show Leaderboard");
  console.log("5. Exit");

  rl.question("Enter your choice: ", (choice) => {

    if (choice === "1") {
      createWallet();
      menu();
    }

    else if (choice === "2") {

      if (!fs.existsSync("public.pem")) {
        console.log("⚠️ No wallet found! Please create one first.");
        return menu();
      }

      const publicKey = fs.readFileSync("public.pem").toString();

      const balance = viewBalance(publicKey);

      console.log(`\nYour balance: ${balance} CLEAN-COINS`);

      menu();
    }

    else if (choice === "3") {
      showAllBalances();
      menu();
    }

    else if (choice === "4") {
      showLeaderboard();
      menu();
    }

    else if (choice === "5") {
      console.log("👋 Exiting wallet...");
      rl.close();
    }

    else {
      console.log("❌ Invalid choice. Try again.");
      menu();
    }

  });
}

// Run CLI
menu();