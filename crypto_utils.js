
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
    privateKey: privateKey,
    publicKey: publicKey
  };
}


// -------- Sign Transaction --------
function signTransaction(privateKeyPem, message) {

  const sign = crypto.createSign("SHA256");

  sign.update(message);
  sign.end();

  const signature = sign.sign(privateKeyPem);

  return signature.toString("base64");
}


// -------- Verify Signature --------
function verifySignature(publicKeyPem, message, signature) {

  const verify = crypto.createVerify("SHA256");

  verify.update(message);
  verify.end();

  try {

    return verify.verify(
      publicKeyPem,
      Buffer.from(signature, "base64")
    );

  } catch (error) {

    console.log("❌ Verification error:", error);
    return false;

  }
}


module.exports = {
  generateWallet,
  signTransaction,
  verifySignature
};