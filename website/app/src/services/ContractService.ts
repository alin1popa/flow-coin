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
                ' @ ' + (request.requestType === RequestType.REGULAR ? request.rate.toString() : 'market price'));
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
                const orderList: any[] = []; // TODO
                const maxPayment = ethers.utils.parseEther('0.05'); // TODO
                const overrides = {
                    value: maxPayment,
                };
                tx = await contract.buyFlow(request.quantity, orderList, overrides);
            } else {
                const orderList: any[] = []; // TODO
                tx = await contract.sellFlow(request.quantity, orderList);
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

    /**
     * @description Gets settlement price for past transactions
     * @returns PriceHistory
     */
    public static GetPriceHistory(): PriceHistory {
        // TODO
        return [
            new PriceAtMoment(new Date(), 0.6, 20),
            new PriceAtMoment(new Date(Date.now() - 24 * 60 * 60 * 1000), 0.5, 25),
        ];
    }
}
