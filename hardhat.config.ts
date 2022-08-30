import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// .envファイルから環境変数をロードします。
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [`0x${process.env.TEST_ACCOUNT_PRIVATE_KEY}`],
    },
    /*
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [`0x${process.env.MAIN_ACCOUNT_PRIVATE_KEY}`],
    },
    */
  },
};

export default config;

/*
module.exports = {
  solidity: "0.8.9",
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc", // Public Avalanche testnet
      chainId: 43113,
      accounts: [process.env.TEST_ACCOUNT_PRIVATE_KEY], // Use your account private key on the Avalanche testnet
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc", // Public Avalanche mainnet
      chainId: 43114,
      accounts: [process.env.MAIN_ACCOUNT_PRIVATE_KEY], // Use your account private key on the Avalanche mainnet
    },
  },
};
*/
/*
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
};

export default config;
*/
/*


*/
