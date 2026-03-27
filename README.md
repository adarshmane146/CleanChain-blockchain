# CleanChain Blockchain (Node.js)

CleanChain is a simple blockchain prototype built using Node.js that rewards users with tokens for performing social impact activities.

The project demonstrates how blockchain systems work internally including wallet generation, digital signatures, mining, and transaction validation.

---

## Features

• Blockchain with Proof-of-Work mining  
• ECDSA digital signatures for transaction security  
• Wallet generation system  
• Signed activity transactions  
• Token reward system (CLEAN-COINS)  
• CLI interface for interacting with the blockchain  
• Leaderboard for contributors  

---

## Example Actions

Users earn CLEAN-COINS for performing social impact activities such as:

- Studying
- Helping others
- Community service
- Job preparation
- Volunteering

Example reward system:

| Action| Reward        |
|-------|---------------|
Study   | 5 CLEAN-COINS |
Clean   | 10 CLEAN-COINS|
Help    | 8 CLEAN-COINS |
Job     | 6 CLEAN-COINS |

---

## Project Structure


CleanChain_blockchain/
│
├── blockchain.js # Blockchain logic
├── wallet_utils.js # Wallet + cryptographic signatures
├── cli.js # Command line interface
├── wallet.js # Wallet dashboard
├── crypto_utils.js # Cryptographic helper functions
├── main.js # Blockchain runner
├── run_script.js # Test script
├── test_wallet.js # Wallet test
├── balances.json # Token balances
├── wallets.json # Stored wallet keys
└── package.json


---

## Installation

Clone the repository:
git clone https://github.com/YOUR_GITHUB_USERNAME/cleanchain-blockchain.git

Install dependencies
npm install

Run the CLI
node cli.js
---
## CLI Menu
Create Wallet
Add Social Impact Activity (Signed)
View Blockchain
Check Blockchain Validity
View User Balances
Exit

---

## Example Blockchain Output
Block #1
User: Adarsh
Action: study
Reward: 5 CLEAN-COINS

Block #2
User: john
Action: help
Reward: 8 CLEAN-COINS

---

## Tech Stack
Node.js  
Crypto (ECDSA)  
JSON Storage  
CLI Interface  

---

## Learning Outcome

This project helped explore core blockchain concepts:

- Proof of Work
- Digital Signatures
- Wallet Management
- Immutable Data Structures
- Token Reward Mechanism

---

## Author

Adarsh Mane  
B.Tech Computer Science Engineering
