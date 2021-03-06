pragma solidity ^0.5.11;


import "./BasicToken.sol";
import "./SafeMath.sol";


/**
 * @title Generated token
 * @dev Token that can be generated by calling the generation function up to a token limit
 */
contract GeneratedToken is BasicToken {
  using SafeMath for uint256;

  uint256 public supplyLimit;
  uint256 public generationRate;

  /**
  * @dev Generates a fixed amount of token for the sender, up to a limit
  */
  function generateToken() public returns (bool) {
    if (totalSupply_ >= supplyLimit) {
        return false;
    }
    
    totalSupply_ = totalSupply_.add(generationRate);
    balances[msg.sender] = balances[msg.sender].add(generationRate);
    emit Transfer(address(0), msg.sender, generationRate);
    return true;
  }
}