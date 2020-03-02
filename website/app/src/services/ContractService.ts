import { Order, Orderbook } from '@/models/Order';
import { OrderType } from '@/constants/OrderType';
import { Request } from '@/models/Request';
import { RequestType } from '@/constants/RequestType';
import { PriceHistory, PriceAtMoment } from '@/models/PriceHistory';
import { EthereumHelper } from '@/helpers/EthereumHelper';
import { StateManager, IAppState } from '@/services/StateManager';
import { ethers } from 'ethers';

export class ContractService {
    /**
     * @description Gets current account's balance
     * @returns number
     */
    public static GetBalance(): number {
        // TODO
        // https://github.com/ethers-io/ethers.js/issues/308

        const state = StateManager.GetInstance().GetState();
        // const contract = EthereumHelper.GetReadWriteContract(state.provider);
        const contract = state.contract;

        contract.balanceOf('0x005E647155bCfd6BE6B6B158CF880909b3B51863')
        .then((value: number) => alert(value));

        return 420.68;
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

        // tslint:disable-next-line
        console.log('Order placed; transaction hash:');
        // tslint:disable-next-line
        console.log(tx.hash);

        await tx.wait();
        state.val = 'MINED'; // todo remove
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
