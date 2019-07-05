export class PriceAtMoment {
    constructor(
        public date: Date,
        public rate: number,
        public volume: number,
    ) {}
}

export type PriceHistory = PriceAtMoment[];
