pragma solidity ^0.4.24;

import "./StandardToken.sol";

/**
 * @title FlowCoin
 *
 * @dev Token with build-in exchange functionalities
 * Based on libraries from openzeppelin
 * https://github.com/OpenZeppelin/openzeppelin-solidity/
 * FlowCoin is a Standard ERC-20 Token
 * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/StandardToken.sol
 */
contract FlowCoin is StandardToken {
    string public constant name = "Flow";
    string public constant symbol = "FLOW";
    uint8 public constant decimals = 18;
    
    mapping (bytes32 => uint256) internal sells;
    
    /**
     * @dev Event dispatched when a sell order is placed
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be sold
     * @param _seller the address of the seller
     * @param _timestamp the block timestamp when order was placed
     */
    event Sell(
        uint256 indexed _ratio,
        uint256 indexed _amount,
        address indexed _seller
    );
    
    /**
     * @dev Place a sell order in the order book
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be sold
     */
    function placeSellOrder(
        uint256 _ratio,
        uint256 _amount
    )   public
        returns (bool)
    {
        require(_amount <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(_amount);
        
        bytes32 orderHash = keccak256(abi.encodePacked(_ratio, msg.sender));
        sells[orderHash] = sells[orderHash].add(_amount);
        
        emit Sell(_ratio, sells[orderHash], msg.sender);
        return true;
    }
    
    /**
     * @dev Retract a sell order from the order book
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be sold
     */
    function retractSellOrder(
        uint256 _ratio,
        uint256 _amount
    )   public
        returns (bool)
    {
        bytes32 orderHash = keccak256(abi.encodePacked(_ratio, msg.sender));
        require(_amount <= sells[orderHash]);
        sells[orderHash] = sells[orderHash].sub(_amount);
        
        balances[msg.sender] = balances[msg.sender].add(_amount);
        
        emit Sell(_ratio, sells[orderHash], msg.sender);
        return true;
    }
    
    
}
 