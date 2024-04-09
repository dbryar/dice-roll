declare var src_default: typeof Roll;
export class Roll {
    static d(dice: any): number;
    static minMax(dice: any, modifier: any): any[];
    constructor(dice?: string, modifier?: number);
    modifier: number;
    dice: number;
    results: any[];
    result: number;
}
export var Dice: any;
export { src_default as default };
