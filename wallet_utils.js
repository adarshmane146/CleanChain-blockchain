const crypto = require("crypto");


// -------- Generate Wallet --------
function generateWallet() {

  const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
    namedCurve: "secp256k1",

    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem"
    },

    publicKeyEncoding: {
      type: "spki",
      format: "pem"
    }
  });

  return {
    privateKey,
    publicKey
  };
}


// -------- Helper: Deterministic JSON --------
function serializeMessage(message) {
  return JSON.stringify(message, Object.keys(message).sort());
}


// -------- Sign Message --------
function signMessage(privateKeyPem, message) {

  const messageStr = serializeMessage(message);

  const sign = crypto.createSign("SHA256");
  sign.update(messageStr);
  sign.end();

  const signature = sign.sign(privateKeyPem);

  return signature.toString("hex");
}


// -------- Verify Signature --------
function verifySignature(publicKeyPem, signatureHex, message) {

  try {

    const messageStr = serializeMessage(message);

    const verify = crypto.createVerify("SHA256");
    verify.update(messageStr);
    verify.end();

    return verify.verify(
      publicKeyPem,
      Buffer.from(signatureHex, "hex")
    );

  } catch (error) {
    return false;
  }
}


module.exports = {
  generateWallet,
  signMessage,
  verifySignature
};


// -------- Quick Test --------
if (require.main === module) {

  console.log("🔑 Testing Wallet Utils");

  const wallet = generateWallet();

  const privateKey = wallet.privateKey;
  const publicKey = wallet.publicKey;

  console.log("Private:", privateKey);
  console.log("Public :", publicKey);

  const msg = { user: "Adarsh", action: "cleaned the road" };

  const signature = signMessage(privateKey, msg);

  console.log("Signature:", signature);

  console.log("✅ Verified:", verifySignature(publicKey, signature, msg));
}