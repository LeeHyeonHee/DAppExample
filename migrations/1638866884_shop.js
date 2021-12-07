var shop = artifacts.require("./Shop.sol");

module.exports = function(_deployer) {
  _deployer.deploy(shop);
};
