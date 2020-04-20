import { Order, Orderbook } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';
import { Request } from '@/models/Request';
import { RequestType } from '@/constants/RequestType';
import { PriceHistory, PriceAtMoment } from '@/models/PriceHistory';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager, IAppState } from '@/services/StateManager';
import { ethers } from 'ethers';
import { Utils } from '@/helpers/Utils';
import { BigNumber } from 'ethers/utils';

function convertJSOrderModelToETHOrderModel(order: Order) {
    return {
        _ratio: order.rate,
        _author: order.address,
    };
}

export class ContractService {
    /**
     * @description Gets current account's balance
     * @returns number
     */
    public static UpdateBalance(): void {
        const state = StateManager.GetInstance().GetState();
        const contract = state.contract;
        const ownAddress = state.ownAddress;

        EthereumHelper.GetBalanceOfAccount(contract, ownAddress)
            .then((value: BigNumber) => state.selfBalance = value);
    }

    /**
     * @description Generates tokens for the user
     */
    public static async Generate() {
        const state = StateManager.GetInstance().GetState();
        const contract = state.contract;

        const tx = await contract.generateToken();

        Utils.LogText('Generate order placed; transaction hash:');
        Utils.LogText(tx.hash);

        await tx.wait();

        Utils.LogText('Token generated');

        this.UpdateBalance();
        this.UpdateTotalSupply();
    }

    /**
     * @description Updates total supply and supply limit of token
     */
    public static UpdateTotalSupply(): void {
        const state = StateManager.GetInstance().GetState();
        const contract = state.contract;
        contract.totalSupply()
            .then((value: BigNumber) => state.totalSupply = value.toNumber());
        contract.supplyLimit()
            .then((value: BigNumber) => state.supplyLimit = value.toNumber());
    }

    /**
     * @description Gets current account's active orders
     * @returns Order[]
     */
    public static GetActiveOrders(state: IAppState): Order[] {
        return state.ownOrders;
    }

    /**
     * @description Places an order request
     * @param request Request
     */
    public static async PlaceOrderRequest(request: Request) {
        const state = StateManager.GetInstance().GetState();
        const contract = state.contract;
        let tx;

        if (request.requestType !== RequestType.RETRACT) {
            Utils.LogText('Placing order to ' + request.orderType +
                ' ' + request.quantity.toString() +
                ' @ ' + (request.requestType === RequestType.REGULAR
                    ? (request.rate.toString() + ' wei')
                    : 'market price'));
        } else {
            Utils.LogText('Placing order to retract ' +
                ' ' + request.quantity.toString() +
                ' @ ' + request.rate.toString());
        }

        if (request.requestType === RequestType.REGULAR) {
            const weiAmount = request.rate;

            if (request.orderType === OrderType.BUY) {
                const overrides = {
                    value: weiAmount.mul(request.quantity),
                };
                tx = await contract.placeBuyOrder(weiAmount, request.quantity, overrides);
            } else {
                tx = await contract.placeSellOrder(weiAmount, request.quantity);
            }
        } else if (request.requestType === RequestType.MARKET) {
            if (request.orderType === OrderType.BUY) {
                const orderList: Order[] = Utils.GetBestOrdersList(state.sellOrders, request.quantity);
                const maxPayment = Utils.EstimateMaxCost(orderList.slice().reverse(), request.quantity);
                const overrides = {
                    value: maxPayment,
                };
                tx = await contract.buyFlow(
                    request.quantity,
                    orderList.map(convertJSOrderModelToETHOrderModel),
                    overrides,
                );
            } else {
                const orderList: Order[] = Utils.GetBestOrdersList(state.buyOrders, request.quantity, true);
                tx = await contract.sellFlow(
                    request.quantity,
                    orderList.map(convertJSOrderModelToETHOrderModel),
                );
            }
        } else if (request.requestType === RequestType.RETRACT) {
            const weiAmount = request.rate;

            if (request.orderType === OrderType.SELL) {
                tx = await contract.retractSellOrder(weiAmount, request.quantity);
            } else {
                tx = await contract.retractBuyOrder(weiAmount, request.quantity);
            }
        }

        Utils.LogText('Order placed; transaction hash:');
        Utils.LogText(tx.hash);

        await tx.wait();

        Utils.LogText('Order mined');
    }

    /**
     * @description Places an order request
     * @param request Request
     */
    public static async RetractOrder(order: Order) {
        const request: Request = {
            orderType: order.type,
            quantity: order.quantity,
            rate: order.rate,
            requestType: RequestType.RETRACT,
        };
        this.PlaceOrderRequest(request);
    }

    /**
     * @description Gets all active orders for all accounts
     * @returns Order[]
     */
    public static GetOrderbook(state: IAppState): Orderbook {
        return {
            buyOrders: state.buyOrders,
            sellOrders: state.sellOrders,
        };
    }
}
