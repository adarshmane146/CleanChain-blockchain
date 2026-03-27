
const fs = require("fs");
const readline = require("readline");
const Blockchain = require("./blockchain");
const { generateWallet, signMessage } = require("./wallet_utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const bc = new Blockchain();

function menu() {
  console.log("\n--- CLEAN-CHAIN CLI ---");
  console.log("1. Create Wallet");
  console.log("2. Add Social Impact Activity (Signed)");
  console.log("3. View Blockchain");
  console.log("4. Check Blockchain Validity");
  console.log("5. View User Balances");
  console.log("6. Exit");

  rl.question("Enter your choice: ", handleChoice);
}

function handleChoice(choice) {

  if (choice === "1") {
    rl.question("Enter your username: ", (username) => {

      const { privateKey, publicKey } = generateWallet();

      let wallets = {};

      if (fs.existsSync("wallets.json")) {
        wallets = JSON.parse(fs.readFileSync("wallets.json"));
      }

      if (wallets[username]) {
        console.log("⚠️ Username already exists!");
      } else {
        wallets[username] = {
          public: publicKey,
          private: privateKey
        };

        fs.writeFileSync(
          "wallets.json",
          JSON.stringify(wallets, null, 4)
        );

        console.log(`✅ Wallet created for ${username}`);
        console.log(`🔑 Private Key: ${privateKey}`);
        console.log(`🔓 Public Key: ${publicKey}`);
      }

      menu();
    });

  } else if (choice === "2") {

    rl.question("Enter your username: ", (user) => {

      if (!fs.existsSync("wallets.json")) {
        console.log("⚠️ No wallets found. Create one first.");
        return menu();
      }

      const wallets = JSON.parse(fs.readFileSync("wallets.json"));

      if (!wallets[user]) {
        console.log("⚠️ Username not found.");
        return menu();
      }

      rl.question("Describe your good action: ", (action) => {

        const privKey = wallets[user].private;

        const message = {
          user: user,
          action: action
        };

        const signature = signMessage(privKey, message);

        bc.addBlock({
          user: user,
          action: action,
          signature: signature
        });

        console.log("✅ Block added successfully and signed!");

        menu();
      });
    });

  } else if (choice === "3") {

    console.log("\n--- Blockchain ---");

    bc.chain.forEach((block) => {
      console.log(`\nBlock #${block.index}`);
      console.log("Timestamp:", block.timestamp);
      console.log("Data:", block.data);
      console.log("Previous Hash:", block.previous_hash);
      console.log("Hash:", block.hash);
    });

    menu();

  } else if (choice === "4") {

    console.log("\nBlockchain Validity:", bc.isChainValid());

    menu();

  } else if (choice === "5") {

    if (fs.existsSync("balances.json")) {

      const balances = JSON.parse(fs.readFileSync("balances.json"));

      console.log("\n--- User Balances ---");

      for (let user in balances) {
        console.log(`${user}: ${balances[user]} CLEAN-COINs`);
      }

    } else {
      console.log("⚠️ No balance data found yet.");
    }

    menu();

  } else if (choice === "6") {

    console.log("👋 Exiting...");
    rl.close();

  } else {

    console.log("❌ Invalid choice. Try again.");
    menu();
  }
}

menu();