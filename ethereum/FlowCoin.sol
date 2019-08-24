pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./StandardToken.sol";
import "./ReentrancyGuard.sol";
import "./SafeMath.sol";
import "./GeneratedToken.sol";


/**
 * @title FlowCoin
 * @dev Token with build-in exchange functionality
 *
 * @author Alin Popa
 * https://github.com/alin1popa/
 *
 * Based on libraries from openzeppelin
 * https://github.com/OpenZeppelin/openzeppelin-solidity/
 * FlowCoin is a Standard ERC-20 Token
 * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/StandardToken.sol
 */
contract FlowCoin is StandardToken, ReentrancyGuard, GeneratedToken {
    using SafeMath for uint256;

    string public constant name = "Flow";
    string public constant symbol = "FLOW";
    uint256 public constant decimals = 4;
    
    constructor() public {
        // total possible coin: 10,000 FC
        // generation rate: 1 FC
        supplyLimit = 10000*10**decimals;
        generationRate = 1*10**decimals;
    
        // premine 10% of supply limit to owner's address
        // premined amount: 1000 FC
        totalSupply_ = 10000*0.10*10**decimals; 
        balances[msg.sender] = 10000*0.10*10**decimals;
    }
    
    
    mapping (bytes32 => uint256) internal sells;
    mapping (bytes32 => uint256) internal buys;
    
    /**
     * @dev Event dispatched when a sell order is placed
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be sold
     * @param _seller the address of the seller
     */
    event Sell(
        uint256 _ratio,
        uint256 _amount,
        address payable _seller
    );
    
    /**
     * @dev Event dispatched when a buy order is placed
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be bought
     * @param _seller the address of the buyer
     */
    event Buy(
        uint256 _ratio,
        uint256 _amount,
        address _seller
    );
    
    /**
     * @dev Struct used to transmit orders to sell and buy functions
     */
    struct Order {
        uint256 _ratio;
        address payable _author;
    }
    
    /**
     * @dev Place a sell order in the order book
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be sold
     */
    function placeSellOrder(
        uint256 _ratio,
        uint256 _amount
    )   external
        nonReentrant
        returns (bool)
    {
        require(_amount > 0);
        require(_ratio > 0);
        
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
    )   external
        nonReentrant
        returns (bool)
    {
        require(_amount > 0);
        require(_ratio > 0);
    
        bytes32 orderHash = keccak256(abi.encodePacked(_ratio, msg.sender));
        require(_amount <= sells[orderHash]);
        sells[orderHash] = sells[orderHash].sub(_amount);
        
        balances[msg.sender] = balances[msg.sender].add(_amount);
        
        emit Sell(_ratio, sells[orderHash], msg.sender);
        return true;
    }
    
    /**
     * @dev Place a buy order in the order book
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be bought
     */
    function placeBuyOrder(
        uint256 _ratio,
        uint256 _amount
    )   external
        nonReentrant
        payable
        returns (bool)
    {
        require(_amount > 0);
        require(_ratio > 0);
        
        uint256 total = _amount.mul(_ratio);
        require(total == msg.value);
        
        bytes32 orderHash = keccak256(abi.encodePacked(_ratio, msg.sender));
        buys[orderHash] = buys[orderHash].add(_amount);
        
        emit Buy(_ratio, buys[orderHash], msg.sender);
        return true;
    }
    
    /**
     * @dev Retract a buy order from the order book
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be bought
     */
    function retractBuyOrder(
        uint256 _ratio,
        uint256 _amount
    )   external
        nonReentrant
        returns (bool)
    {
        require(_amount > 0);
        require(_ratio > 0);
        
        bytes32 orderHash = keccak256(abi.encodePacked(_ratio, msg.sender));
        require(_amount <= buys[orderHash]);
        buys[orderHash] = buys[orderHash].sub(_amount);
        
        uint256 total = _amount.mul(_ratio);
        msg.sender.transfer(total);
        
        emit Buy(_ratio, buys[orderHash], msg.sender);
        return true;
    }
    
    /**
     * @dev Fill one particular buy order from the order book
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be sold
     * @param _buyer the address of the buyer
     */
    function fillBuyOrder(
        uint256 _ratio,
        uint256 _amount,
        address _buyer
    )   private
        returns (uint256)
    {
        uint256 ethToTransfer;
        uint256 flowToTransfer;
        
        bytes32 orderHash = keccak256(abi.encodePacked(_ratio, _buyer));
        if (buys[orderHash] >= _amount) {
            flowToTransfer = _amount;
        } else {
            flowToTransfer = buys[orderHash];
        }
        
        if (flowToTransfer != 0) {
            ethToTransfer = flowToTransfer.mul(_ratio);
            
            buys[orderHash] = buys[orderHash].sub(flowToTransfer);
            balances[msg.sender] = balances[msg.sender].sub(flowToTransfer);
            balances[_buyer] = balances[_buyer].add(flowToTransfer);
            
            msg.sender.transfer(ethToTransfer);
            
            emit Buy(_ratio, buys[orderHash], _buyer);
            emit Transfer(msg.sender, _buyer, flowToTransfer);
        }
        
        return _amount - flowToTransfer;
    }
    
    /**
     * @dev Fill one particular sell order from the order book
     * @param _ratio the ratio of FLOW-to-ETH
     * @param _amount the amount of tokens to be bought
     * @param _seller the address of the seller
     */
    function fillSellOrder(
        uint256 _ratio,
        uint256 _amount,
        address payable _seller,
        uint256 _payment
    )   private
        returns (uint256, uint256)
    {
        uint256 ethToTransfer;
        uint256 flowToTransfer;
        
        bytes32 orderHash = keccak256(abi.encodePacked(_ratio, _seller));
        if (sells[orderHash] >= _amount) {
            flowToTransfer = _amount;
        } else {
            flowToTransfer = sells[orderHash];
        }
        
        if (flowToTransfer != 0) {
            ethToTransfer = flowToTransfer.mul(_ratio);
            if (_payment < ethToTransfer) {
                ethToTransfer = _payment;
                flowToTransfer = _payment.div(_ratio);
            }
            
            sells[orderHash] = sells[orderHash].sub(flowToTransfer);
            balances[msg.sender] = balances[msg.sender].add(flowToTransfer);
            
            _seller.transfer(ethToTransfer);
            
            emit Sell(_ratio, sells[orderHash], _seller);
            emit Transfer(_seller, msg.sender, flowToTransfer);
        }
        
        return (_amount - flowToTransfer, _payment - ethToTransfer);
    }
    
    /**
     * @dev Sell flow by filling buy orders
     * @param _amount the amount of tokens to be sold
     * @param _orders the orders to fill
     */
    function sellFlow(
        uint256 _amount,
        Order[] calldata _orders
    )   external
        nonReentrant
        returns (uint256)
    {
        require(_amount > 0);
        require(_amount <= balances[msg.sender]);
        
        uint256 amount_left = _amount;
        
        for (uint256 i = 0; i < _orders.length && amount_left > 0; i++) {
            amount_left = fillBuyOrder(_orders[i]._ratio, amount_left, _orders[i]._author);
        }
        
        return amount_left;
    }
    
    /**
     * @dev Buy flow by filling sell orders
     * @param _amount the amount of tokens to be bought
     * @param _orders the orders to fill
     */
    function buyFlow(
        uint256 _amount,
        Order[] calldata _orders
    )   external
        nonReentrant
        payable
        returns (uint256)
    {
        require(_amount > 0);
        require(msg.value > 0);
        
        uint256 amount_left = _amount;
        uint256 payment = msg.value;
        
        for (uint256 i = 0; i < _orders.length && amount_left > 0 && payment > 0; i++) {
            (amount_left, payment) = fillSellOrder(_orders[i]._ratio, amount_left, _orders[i]._author, payment);
        }
        
        if (payment > 0) {
            msg.sender.transfer(payment);
        }
        
        return amount_left;
    }
}
