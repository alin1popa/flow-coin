import { Order } from '@/models/Order';
import { utils } from 'ethers';
import { BigNumber } from 'ethers/utils';

export class Utils {
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
        const str = count.toString();
        if (str.length <= 6) {
            return str;
        }

        return str[0] + '.' + str.slice(1, 3) + 'E+' + (str.length - 1).toString();
    }
}