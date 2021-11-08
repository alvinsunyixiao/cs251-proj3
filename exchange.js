// =================== CS251 DEX Project =================== //
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //

// sets up web3.js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const exchange_name = 'QuantumSwap'; // TODO: fill in the name of your exchange

const token_name = 'QuantumDot';             // TODO: replace with name of your token
const token_symbol = 'QDOT';               // TODO: replace with symbol for your token


// =============================================================================
//         ABIs and Contract Addresses: Paste Your ABIs/Addresses Here
// =============================================================================
// TODO: Paste your token contract address and ABI here:
const token_address = '0x0e0Fe0e70C6a8E7cC98A0da17966dEadf2735704';
const token_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "_disable_mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "_mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "delegate",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "delegate",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const token_contract = new web3.eth.Contract(token_abi, token_address);

// TODO: Paste your exchange address and ABI here
const exchange_address = '0x9B418CB218B1C464A674cdf38DeA9f26C370A764';
const exchange_abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "AddLiquidity",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RemoveLiquidity",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "minAmountToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxAmountToken",
        "type": "uint256"
      }
    ],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountTokens",
        "type": "uint256"
      }
    ],
    "name": "createPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eth_reserves",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllLiquidityInETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "k",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      }
    ],
    "name": "priceETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountTokens",
        "type": "uint256"
      }
    ],
    "name": "priceToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "minAmountToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxAmountToken",
        "type": "uint256"
      }
    ],
    "name": "removeAllLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minAmountToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxAmountToken",
        "type": "uint256"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "minAmountToken",
        "type": "uint256"
      }
    ],
    "name": "swapETHForTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountTokens",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minAmountETH",
        "type": "uint256"
      }
    ],
    "name": "swapTokensForETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenAddr",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token_reserves",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const exchange_contract = new web3.eth.Contract(exchange_abi, exchange_address);



// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the below functions

/*** INIT ***/
async function init() {
  var poolState = await getPoolState();
  if (poolState['token_liquidity'] === 0
    && poolState['eth_liquidity'] === 0) {
    // Call mint twice to make sure mint can be called mutliple times prior to disable_mint
    const total_supply = web3.utils.toWei("10", "ether");
    const half_supply = web3.utils.toWei("5", "ether");
    await token_contract.methods._mint(half_supply).send({from:web3.eth.defaultAccount, gas : 999999});
    await token_contract.methods._mint(half_supply).send({from:web3.eth.defaultAccount, gas : 999999});
    await token_contract.methods._disable_mint().send({from:web3.eth.defaultAccount, gas : 999999});
    await token_contract.methods.approve(exchange_address, total_supply).send({from:web3.eth.defaultAccount});
    // initialize pool with equal amounts of ETH and tokens, so exchange rate begins as 1:1
    await exchange_contract.methods.createPool(total_supply).send({from:web3.eth.defaultAccount, value : total_supply, gas : 999999});

    // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
  }
}

async function getPoolState() {
  // read pool balance for each type of liquidity
  let liquidity_tokens = await exchange_contract.methods.token_reserves().call({from:web3.eth.defaultAccount});
  let liquidity_eth = await exchange_contract.methods.eth_reserves().call({from:web3.eth.defaultAccount});
  return {
    token_liquidity: liquidity_tokens * 10**(-18),
    eth_liquidity: liquidity_eth * 10**(-18),
    token_eth_rate: liquidity_tokens / liquidity_eth,
    eth_token_rate: liquidity_eth / liquidity_tokens
  };
}

// This is a log function, provided if you want to display things to the page instead of the
// JavaScript console. It may be useful for debugging but usage is not required.
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
  $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}

// ============================================================
//                    FUNCTIONS TO IMPLEMENT
// ============================================================

// Note: maxSlippagePct will be passed in as an int out of 100.
// Be sure to divide by 100 for your calculations.

/*** ADD LIQUIDITY ***/
async function addLiquidity(amountEth, maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  let poolState = await getPoolState();
  let maxAmountToken = amountEth * poolState["token_eth_rate"] * (1.0 + maxSlippagePct / 100.0);
  let minAmountToken = amountEth * poolState["token_eth_rate"] * (1.0 - maxSlippagePct / 100.0);

  // convert big ints to strings
  amountEth = web3.utils.toWei(amountEth.toString(), "ether");
  minAmountToken = web3.utils.toWei(minAmountToken.toString(), "ether");
  maxAmountToken = web3.utils.toWei(maxAmountToken.toString(), "ether");

  await token_contract.methods.approve(exchange_address, maxAmountToken).send({
    from:web3.eth.defaultAccount
  });
  await exchange_contract.methods.addLiquidity(minAmountToken, maxAmountToken).send({
    from:web3.eth.defaultAccount, value: amountEth, gas: 999999
  });
}

/*** REMOVE LIQUIDITY ***/
async function removeLiquidity(amountEth, maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  let poolState = await getPoolState();
  let maxAmountToken = amountEth * poolState["token_eth_rate"] * (1.0 + maxSlippagePct / 100.0);
  let minAmountToken = amountEth * poolState["token_eth_rate"] * (1.0 - maxSlippagePct / 100.0);

  // convert big ints to string
  amountEth = web3.utils.toWei(amountEth.toString(), "ether");
  minAmountToken = web3.utils.toWei(minAmountToken.toString(), "ether");
  maxAmountToken = web3.utils.toWei(maxAmountToken.toString(), "ether");

  await exchange_contract.methods.removeLiquidity(
      amountEth, minAmountToken, maxAmountToken).send({
    from:web3.eth.defaultAccount, value: 0, gas: 999999});
}

async function removeAllLiquidity(maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  let poolState = await getPoolState();

  let amountEth = await exchange_contract.methods.getAllLiquidityInETH().call({
    from:web3.eth.defaultAccount
  });
  let maxAmountToken = amountEth * poolState["token_eth_rate"] * (1.0 + maxSlippagePct / 100.0);
  let minAmountToken = amountEth * poolState["token_eth_rate"] * (1.0 - maxSlippagePct / 100.0);

  // convert big ints to string
  minAmountToken = Math.floor(minAmountToken).toString();
  maxAmountToken = Math.floor(maxAmountToken).toString();

  await exchange_contract.methods.removeAllLiquidity(minAmountToken, maxAmountToken).send({
    from:web3.eth.defaultAccount, value: 0, gas: 999999
  });
}

/*** SWAP ***/
async function swapTokensForETH(amountToken, maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  let poolState = await getPoolState();
  let minAmountETH = amountToken * poolState["eth_token_rate"] * (1.0 - maxSlippagePct / 100.0);

  // convert bit ints to string
  amountToken = web3.utils.toWei(amountToken.toString(), "ether");
  minAmountETH = web3.utils.toWei(minAmountETH.toString(), "ether");

  await token_contract.methods.approve(exchange_address, amountToken).send({
    from:web3.eth.defaultAccount
  });
  await exchange_contract.methods.swapTokensForETH(amountToken, minAmountETH).send({
    from:web3.eth.defaultAccount, value : 0, gas : 999999});
}

async function swapETHForTokens(amountETH, maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  let poolState = await getPoolState();
  let minAmountToken = amountETH * poolState["token_eth_rate"] * (1.0 - maxSlippagePct / 100.0);

  // convert bit ints to string
  amountETH = web3.utils.toWei(amountETH.toString(), "ether");
  minAmountToken = web3.utils.toWei(minAmountToken.toString(), "ether");

  await exchange_contract.methods.swapETHForTokens(minAmountToken).send({
    from:web3.eth.defaultAccount, value : amountETH, gas : 999999});
}

// =============================================================================
//                            UI (DO NOT MOFIDY)
// =============================================================================


// This sets the default account on load and displays the total owed to that
// account.
web3.eth.getAccounts().then((response)=> {
  web3.eth.defaultAccount = response[0];
  // Initialize the exchange
  init().then(() => {
    // fill in UI with current exchange rate:
    getPoolState().then((poolState) => {
      $("#eth-token-rate-display").html("1 ETH = " + poolState['token_eth_rate'] + " " + token_symbol);
      $("#token-eth-rate-display").html("1 " + token_symbol + " = " + poolState['eth_token_rate'] + " ETH");

      $("#token-reserves").html(poolState['token_liquidity'] + " " + token_symbol);
      $("#eth-reserves").html(poolState['eth_liquidity'] + " ETH");
    });
  });

  web3.eth.getBalance(web3.eth.defaultAccount).then((res) => {
    $("#account-eth-balance").html("Ethereum balance: " + parseInt(res, 10) * 10**(-18) + " ETH");
  });
  token_contract.methods.balanceOf(web3.eth.defaultAccount).call({from:web3.eth.defaultAccount}).then((res) => {
    $("#account-tok-balance").html(token_name + " balance: " + parseInt(res, 10) * 10 **(-18) + " " + token_symbol);
  });;
});

// This code updates the 'My Account' UI with the balances of the account
$("#myaccount").change(function() {
  web3.eth.defaultAccount = $(this).val();
  web3.eth.getBalance(web3.eth.defaultAccount).then((res) => {
    $("#account-eth-balance").html("Ethereum balance: " + parseInt(res, 10) * 10**(-18) + " ETH");
  });
  token_contract.methods.balanceOf(web3.eth.defaultAccount).call({from:web3.eth.defaultAccount}).then((res) => {
    $("#account-tok-balance").html(token_name + " balance: " + parseInt(res, 10) * 10 **(-18) + " " + token_symbol);
  });;
});

// Allows switching between accounts in 'My Account'
web3.eth.getAccounts().then((response)=>{
  var opts = response.map(function (a) { return '<option value="'+
      a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
  $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function() {
  web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  swapETHForTokens($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response)=>{
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function() {
  web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  swapTokensForETH($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response)=>{
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function() {
  web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  addLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response)=>{
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity").click(function() {
  web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  removeLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response)=>{
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// This runs the 'removeAllLiquidity' function when you click the button
$("#remove-all-liquidity").click(function() {
  web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  removeAllLiquidity($("#max-slippage-liquid").val()).then((response)=>{
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  })
});

// Fills in relevant parts of UI with your token and exchange name info:
$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name);

$("#exchange-title-header").html(exchange_name);



// =============================================================================
//                                SANITY CHECK
// =============================================================================

// This section contains a sanity check test that you can use to ensure your code
// works. We will be testing your code this way, so make sure you at least pass
// the given test. You are encouraged to write more tests!

// Uncomment the call to sanityCheck() (last line) to have it run when index.html is launched.

function check(name, condition) {
  if (condition) {
    console.log(name + ": SUCCESS");
    return 3;
  } else {
    console.log(name + ": FAILED");
    return 0;
  }
}

async function sanityCheck() {
  var score = 0;
  var accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];

  console.log ("\nTEST", "Swapping 10000000 wei for Tokens");
  await swapETHForTokens(10000000, 10);
  var eth_reserves = await exchange_contract.methods.eth_reserves().call();
  var token_reserves = await exchange_contract.methods.token_reserves().call();
  // Accounting for LP fees, if they have already implemented Part 5
  score += check("eth_reserves updated correctly", eth_reserves > 10000000000 && eth_reserves <= 10010000000);
  score += check("token_reserves updated correctly", token_reserves < 10000000000 && token_reserves >= 9990000000);
  // Check tokens and ETH were actually transferred
  var num_tokens = await token_contract.methods.balanceOf(web3.eth.defaultAccount).call();
  score += check("Tokens were successfully transferred", num_tokens > 0 && num_tokens <= 10000000);


  console.log("\nTEST", "Adding Liquidity");
  eth_reserves = await exchange_contract.methods.eth_reserves().call();
  await addLiquidity(1000000, 10);
  var eth_reserves_1 = await exchange_contract.methods.eth_reserves().call();
  var token_reserves_1 = await exchange_contract.methods.token_reserves().call();
  score += check("eth_reserves updated correctly", eth_reserves_1 > eth_reserves);
  score += check("token_reserves updated correctly", token_reserves_1 > token_reserves);
  // Check tokens were actually transferred
  var num_tokens_2 = await token_contract.methods.balanceOf(web3.eth.defaultAccount).call();
  score += check("Tokens were successfully transferred to the pool", num_tokens_2 < num_tokens);

  console.log("\nTEST", "Removing Liquidity");
  await removeLiquidity(100000, 10);
  var eth_reserves_2 = await exchange_contract.methods.eth_reserves().call();
  var token_reserves_2 = await exchange_contract.methods.token_reserves().call();
  score += check("eth_reserves updated correctly", eth_reserves_2 == eth_reserves_1 - 100000);
  score += check("token_reserves updated correctly", token_reserves_2 < token_reserves_1);
  // Check tokens were actually transferred
  var num_tokens_3 = await token_contract.methods.balanceOf(web3.eth.defaultAccount).call();
  score += check("Tokens were successfully transferred to user", num_tokens_3 > num_tokens_2);


  console.log("\nTEST", "Swap Tokens for ETH");
  await swapTokensForETH(100000, 10);
  var eth_reserves_final = await exchange_contract.methods.eth_reserves().call();
  var token_reserves_3 = await exchange_contract.methods.token_reserves().call();
  score += check("eth_reserves updated correctly", eth_reserves_final < eth_reserves_2);
  score += check("token_reserves updated correctly", token_reserves_3 > token_reserves_2);
  // Check tokens and ETH were actually transferred
  var final_tokens = 	await token_contract.methods.balanceOf(web3.eth.defaultAccount).call();
  score += check("Tokens were successfully traded", final_tokens < num_tokens_3);

  // TODO: Students write their own tests for Part 4 + 5, since it depends on their design
  console.log("Final Score: " + score +"/36");
}

// Uncomment this to run when directly opening index.html
// sanityCheck();
