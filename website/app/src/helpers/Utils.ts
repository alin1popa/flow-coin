import { Order } from '@/models/Order';
import { utils } from 'ethers';
import { BigNumber, bigNumberify } from 'ethers/utils';
import { IAppState, ILog, StateManager } from '@/services/StateManager';

export class Utils {
    public static TOKEN_DECIMALS = 4;

    public static OrderInsertOrUpdate(order: Order, array: Order[]) {
        let left = 0;
        let right = array.length;
        let mid;
        let index = 0;

        while (right > left) {
            mid = Math.floor((left + right) / 2);

            if (mid >= array.length) {
                index = array.length;
                break;
            }

            if (order.equalTo(array[mid])) {
                index = mid;
                break;
            }

            if (order.greaterThan(array[mid])) {
                left = mid + 1;
            } else {
                right = mid;
            }

            index = right;
        }

        if (index < array.length && index >= 0 && order.equalTo(array[index])) {
            array[index] = order;
            if (order.quantity.isZero()) {
                array.splice(index, 1);
            }
        } else {
            array.splice(index, 0, order);
        }
    }

    public static FormatAddressForDisplay(address: string): string {
        return address.slice(0, 4) + '..' + address.slice(-4, -1);
    }

    public static ComputeOptimalPriceUnit(price: BigNumber): string {
        const units = ['wei', 'kwei', 'mwei', 'gwei', 'ether'];

        let index = 0;
        let converted: string;
        while (index < units.length) {
            converted = utils.formatUnits(price, units[index]);
            const decimalIndex = converted.indexOf('.');
            if (!(decimalIndex === undefined || decimalIndex > 3)) {
                break;
            }
            index++;
        }
        if (index === units.length) {
            index--;
        }

        return units[index];
    }

    public static FormatFCCountForDisplay(count: BigNumber): string {
        let str = (count.toNumber() / Math.pow(10, this.TOKEN_DECIMALS)).toString();
        if (str.length <= 7) {
            return str;
        }

        str = count.toNumber().toString();
        return str[0] + '.' + str.slice(1, 3) + 'E+' + (str.length - 1 - this.TOKEN_DECIMALS).toString();
    }

    public static LogText(text: string) {
        const state = StateManager.GetInstance().GetState();
        const newlog: ILog = {
            time: new Date().toLocaleTimeString(),
            id: state.logs.length,
            text,
        };
        state.logs.push(newlog);
        // tslint:disable-next-line:no-console
        console.log(text);
    }

    public static scrollToBottom(id: string) {
      const element = document.getElementById(id);
      element!.scrollTop = element!.scrollHeight;
    }

    public static GetBestOrdersList(orders: Order[], quantity: BigNumber, reverse: boolean = false): Order[] {
        // reserve factor*(asked quantity) to make sure requester receives enough currency
        const factor = 4;

        let index = 0;
        let totalQuantity = new BigNumber(0);
        const listOfOrders = reverse ? orders.slice().reverse() : orders;

        while (index < orders.length && totalQuantity.lt(quantity.mul(factor))) {
            totalQuantity = totalQuantity.add(listOfOrders[index].quantity);
            index++;
        }

        return listOfOrders.slice(0, index);
    }

    public static EstimateMaxCost(sortedOrders: Order[], quantity: BigNumber): BigNumber {
        // TODO base cost
        const baseCost = bigNumberify(0); // may not be needed
        let totalCost = bigNumberify(0);

        let totalQuantity = new BigNumber(quantity);
        let currentQuantity = new BigNumber(0);
        let index = 0;

        while (totalQuantity.gt(0)) {
            currentQuantity = new BigNumber(sortedOrders[index].quantity);
            if (currentQuantity.gte(totalQuantity)) {
                currentQuantity = new BigNumber(totalQuantity);
            }

            totalQuantity = totalQuantity.sub(currentQuantity);
            totalCost = totalCost.add(currentQuantity.mul(sortedOrders[index].rate));

            index++;
        }

        return totalCost.add(baseCost);
    }

    public static PriceIncludingDecimals(price: BigNumber) {
        return price.mul(Math.pow(10, this.TOKEN_DECIMALS));
    }

    public static ComputeMinimumPrice() {
        return Math.pow(10, this.TOKEN_DECIMALS);
    }
}
