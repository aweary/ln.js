import { ShapeT } from "./shape";
export default class Hit {
    shape: ShapeT;
    t: number;
    constructor(shape: ShapeT, t: number);
    ok(): boolean;
    min(b: Hit): Hit;
    max(b: Hit): Hit;
}
export declare const NoHit: Hit;
