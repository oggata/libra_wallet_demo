var express = require('express');
const libra_core = require("libra-core");
var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/new_wallet', function (req, res, next) {
  const LibraWallet = libra_core.LibraWallet;
  const wallet = new LibraWallet();
  const account = wallet.newAccount();
  const secretKey = account.keyPair.getSecretKey();
  const secretKeyStr = Buffer.from(secretKey).toString('hex');
  console.log(`account secret: ${secretKeyStr}`);
  res.json({
    status: "ok",
    address: account.getAddress().toHex(),
    secret: secretKeyStr
  });
});
router.get('/mint', function (req, res, next) {
  const LibraWallet = libra_core.LibraWallet;
  const LibraClient = libra_core.LibraClient;
  const LibraNetwork = libra_core.LibraNetwork;
  const wallet = new LibraWallet();
  const account = wallet.newAccount();
  async function mint(account, amount) {
    const client = new LibraClient({
      network: LibraNetwork.Testnet
    });
    await client.mintWithFaucetService(account.getAddress(), amount * 1e6);
  }
  mint(account, 10000);
  res.json({
    status: "ok",
    address: account.getAddress().toHex()
  });
});
router.get('/balance', function (req, res, next) {
  const LibraWallet = libra_core.LibraWallet;
  const LibraClient = libra_core.LibraClient;
  const LibraNetwork = libra_core.LibraNetwork;
  const wallet = new LibraWallet();
  const account = wallet.newAccount();
  async function getBalance(address) {
    const client = new LibraClient({
      network: LibraNetwork.Testnet
    });
    const accountState = await client.getAccountState(address);
    console.log(accountState.balance.toNumber() / 1e6);
  }
  getBalance(account.getAddress());
  res.json({
    status: "ok",
    address: account.getAddress().toHex()
  });
});
module.exports = router;