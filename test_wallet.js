const {
  generateWallet,
  signTransaction,
  verifySignature
} = require("./crypto_utils");

// Step 1: Create new wallet
const wallet = generateWallet();

const privateKey = wallet.privateKey;
const publicKey = wallet.publicKey;

console.log("Wallet created");
console.log("Public Key:\n", publicKey);

// Step 2: Sign a message
const message = "Adarsh pays Bob 10 CLEAN-COINS";

const signature = signTransaction(privateKey, message);

console.log("\nSignature:", signature);

// Step 3: Verify signature
const valid = verifySignature(publicKey, message, signature);

console.log("\nSignature valid?", valid);