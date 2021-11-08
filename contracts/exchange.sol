// =================== CS251 DEX Project =================== //
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '../interfaces/erc20_interface.sol';
import '../libraries/safe_math.sol';
import './token.sol';


contract TokenExchange {
    using SafeMath for uint;
    address public admin;

    address public constant tokenAddr = 0x0e0Fe0e70C6a8E7cC98A0da17966dEadf2735704;  // TODO: Paste token contract address here.
    QuantumDot private token = QuantumDot(tokenAddr);         // TODO: Replace "Token" with your token class.

    // Liquidity pool for the exchange
    uint public token_reserves = 0;
    uint public eth_reserves = 0;

    // Constant: x * y = k
    uint public k;

    // liquidity rewards
    uint private constant swap_fee_numerator = 1;       // TODO Part 5: Set liquidity providers' returns.
    uint private constant swap_fee_denominator = 100;

    // liquidity provider contribution tracker
    uint private totalContrib;
    mapping (address => uint) private contrib;
    mapping (address => bool) private isProvider;
    address[] private providers;

    event AddLiquidity(address from, uint amount);
    event RemoveLiquidity(address to, uint amount);

    constructor()
    {
        admin = msg.sender;
    }

    modifier AdminOnly {
        require(msg.sender == admin, "Only admin can use this function!");
        _;
    }

    // Function createPool: Initializes a liquidity pool between your Token and ETH.
    // ETH will be sent to pool in this transaction as msg.value
    // amountTokens specifies the amount of tokens to transfer from the liquidity provider.
    // Sets up the initial exchange rate for the pool by setting amount of token and amount of ETH.
    function createPool(uint amountTokens)
        external
        payable
        AdminOnly
    {
        // This function is already implemented for you; no changes needed

        // require pool does not yet exist
        require (token_reserves == 0, "Token reserves was not 0");
        require (eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent
        require (msg.value > 0, "Need ETH to create pool.");
        require (amountTokens > 0, "Need tokens to create pool.");

        token.transferFrom(msg.sender, address(this), amountTokens);
        eth_reserves = msg.value;
        token_reserves = amountTokens;
        k = eth_reserves.mul(token_reserves);

        // initialize contribution tracker
        totalContrib = msg.value;
        contrib[msg.sender] = msg.value;
    }

    // ============================================================
    //                    FUNCTIONS TO IMPLEMENT
    // ============================================================
    /* Be sure to use the SafeMath library for all operations! */

    // Function priceToken: Calculate the price of your token in ETH.
    // You can change the inputs, or the scope of your function, as needed.
    function priceToken(uint amountTokens)
        public
        view
        returns (uint)
    {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate how much ETH is of equivalent worth based on the current exchange rate.
        */
        return eth_reserves.sub(k.div(token_reserves.add(amountTokens)));
    }

    // Function priceETH: Calculate the price of ETH for your token.
    // You can change the inputs, or the scope of your function, as needed.
    function priceETH(uint amountETH)
        public
        view
        returns (uint)
    {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate how much of your token is of equivalent worth based on the current exchange rate.
        */
        return token_reserves.sub(k.div(eth_reserves.add(amountETH)));
    }


    /* ========================= Liquidity Provider Functions =========================  */

    // Function addLiquidity: Adds liquidity given a supply of ETH (sent to the contract as msg.value)
    // You can change the inputs, or the scope of your function, as needed.
    function addLiquidity(uint minAmountToken, uint maxAmountToken)
        external
        payable
    {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate the liquidity to be added based on what was sent in and the prices.
            If the caller possesses insufficient tokens to equal the ETH sent, then transaction must fail.
            Update token_reserves, eth_reserves, and k.
            Emit AddLiquidity event.
        */
        require(msg.value > 0, "require positive liquidity to add");

        uint amountTokens = msg.value.mul(token_reserves).div(eth_reserves);
        require(amountTokens <= token.balanceOf(msg.sender), "caller possesses insufficient tokens");

        // slippage check
        require(amountTokens <= maxAmountToken && amountTokens >= minAmountToken,
                "exchange rate has changed more then slippage allowance");

        // perform transfer
        token.transferFrom(msg.sender, address(this), amountTokens);

        // update contribution tracker
        if (!isProvider[msg.sender]) {
            isProvider[msg.sender] = true;
            providers.push(msg.sender);
        }
        uint addedContrib = totalContrib.mul(msg.value).div(eth_reserves);
        contrib[msg.sender] = contrib[msg.sender].add(addedContrib);
        totalContrib = totalContrib.add(addedContrib);

        // update reserves
        eth_reserves = eth_reserves.add(msg.value);
        token_reserves = token_reserves.add(amountTokens);
        k = eth_reserves.mul(token_reserves);

        emit AddLiquidity(msg.sender, msg.value);
    }


    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    // You can change the inputs, or the scope of your function, as needed.
    function removeLiquidity(uint amountETH, uint minAmountToken, uint maxAmountToken)
        public
        payable
    {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate the amount of your tokens that should be also removed.
            Transfer the ETH and Token to the provider.
            Update token_reserves, eth_reserves, and k.
            Emit RemoveLiquidity event.
        */
        require(amountETH > 0, "require positive liquidity to remove");
        uint totalETH = eth_reserves.mul(contrib[msg.sender]).div(totalContrib);
        require(amountETH <= totalETH, "amountETH exceeds liquidity limit of the provider");

        uint amountTokens = amountETH.mul(token_reserves).div(eth_reserves);

        // slippage check
        require(amountTokens <= maxAmountToken && amountTokens >= minAmountToken,
                "exchange rate has changed more then slippage allowance");

        // perform transaction
        token.transfer(msg.sender, amountTokens);
        payable(msg.sender).transfer(amountETH);

        // update contribution tracker
        uint contribRemoved = totalContrib.mul(amountETH).div(eth_reserves);
        contrib[msg.sender] = contrib[msg.sender].sub(contribRemoved);
        totalContrib = totalContrib.sub(contribRemoved);

        // update reserves
        eth_reserves = eth_reserves.sub(amountETH);
        token_reserves = token_reserves.sub(amountTokens);
        k = eth_reserves.mul(token_reserves);

        emit RemoveLiquidity(msg.sender, amountETH);
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    // You can change the inputs, or the scope of your function, as needed.
    function removeAllLiquidity(uint minAmountToken, uint maxAmountToken)
        external
        payable
    {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Decide on the maximum allowable ETH that msg.sender can remove.
            Call removeLiquidity().
        */
        require(contrib[msg.sender] > 0, "caller did not provide any liquidity");

        uint totalETH = getAllLiquidityInETH();
        removeLiquidity(totalETH, minAmountToken, maxAmountToken);
    }

    /***  Define helper functions for liquidity management here as needed: ***/

    function getAllLiquidityInETH() public view returns(uint) {
        return eth_reserves.mul(contrib[msg.sender]).div(totalContrib);
    }

    /* ========================= Swap Functions =========================  */

    // Function swapTokensForETH: Swaps your token with ETH
    // You can change the inputs, or the scope of your function, as needed.
    function swapTokensForETH(uint amountTokens, uint minAmountETH)
        external
        payable
    {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate amount of ETH should be swapped based on exchange rate.
            Transfer the ETH to the provider.
            If the caller possesses insufficient tokens, transaction must fail.
            If performing the swap would exhaus total ETH supply, transaction must fail.
            Update token_reserves and eth_reserves.

            Part 4:
                Expand the function to take in addition parameters as needed.
                If current exchange_rate > slippage limit, abort the swap.

            Part 5:
                Only exchange amountTokens * (1 - liquidity_percent),
                    where % is sent to liquidity providers.
                Keep track of the liquidity fees to be added.
        */
        require(amountTokens <= token.balanceOf(msg.sender), "caller possesses insufficient tokens");
        require(amountTokens <= token.allowance(msg.sender, address(this)), "caller did not approve enough tokens");

        uint token_reserves_new = token_reserves.add(amountTokens);
        uint eth_reserves_new = k.div(token_reserves_new);
        require(eth_reserves_new > 0, "the swap would exhaus total ETH supply");

        // slippage check
        uint amountETH = eth_reserves.sub(eth_reserves_new);
        require(amountETH >= minAmountETH, "slippage occured");

        // perform the swap
        token.transferFrom(msg.sender, address(this), amountTokens);
        payable(msg.sender).transfer(amountETH);

        // update reserve
        eth_reserves = eth_reserves_new;
        token_reserves = token_reserves_new;

        /***************************/
        // DO NOT CHANGE BELOW THIS LINE
        /* Check for x * y == k, assuming x and y are rounded to the nearest integer. */
        // Check for Math.abs(token_reserves * eth_reserves - k) < (token_reserves + eth_reserves + 1));
        //   to account for the small decimal errors during uint division rounding.
        uint check = token_reserves.mul(eth_reserves);
        if (check >= k) {
            check = check.sub(k);
        }
        else {
            check = k.sub(check);
        }
        assert(check < (token_reserves.add(eth_reserves).add(1)));
    }



    // Function swapETHForTokens: Swaps ETH for your tokens.
    // ETH is sent to contract as msg.value.
    // You can change the inputs, or the scope of your function, as needed.
    function swapETHForTokens(uint minAmountToken)
        external
        payable
    {
        /******* TODO: Implement this function *******/
        /* HINTS:
            Calculate amount of your tokens should be swapped based on exchange rate.
            Transfer the amount of your tokens to the provider.
            If performing the swap would exhaus total token supply, transaction must fail.
            Update token_reserves and eth_reserves.

            Part 4:
                Expand the function to take in addition parameters as needed.
                If current exchange_rate > slippage limit, abort the swap.

            Part 5:
                Only exchange amountTokens * (1 - %liquidity),
                    where % is sent to liquidity providers.
                Keep track of the liquidity fees to be added.
        */
        uint eth_reserves_new = eth_reserves.add(msg.value);
        uint token_reserves_new = k.div(eth_reserves_new);
        require(token_reserves_new > 0, "the swap would exhaus total token supply");

        // slippage check
        uint amountTokens = token_reserves.sub(token_reserves_new);
        require(amountTokens >= minAmountToken, "slippage occured");

        // perform swap
        token.transfer(msg.sender, amountTokens);

        // update reserve
        eth_reserves = eth_reserves_new;
        token_reserves = token_reserves_new;

        /**************************/
        // DO NOT CHANGE BELOW THIS LINE
        /* Check for x * y == k, assuming x and y are rounded to the nearest integer. */
        // Check for Math.abs(token_reserves * eth_reserves - k) < (token_reserves + eth_reserves + 1));
        //   to account for the small decimal errors during uint division rounding.
        uint check = token_reserves.mul(eth_reserves);
        if (check >= k) {
            check = check.sub(k);
        }
        else {
            check = k.sub(check);
        }
        assert(check < (token_reserves.add(eth_reserves).add(1)));
    }

    /***  Define helper functions for swaps here as needed: ***/

}

