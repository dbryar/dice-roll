import type { Dice } from "."

/**
 * Roll n dice of type d, and add a modifier (if set) to the total
 * @default 1d20
 * @values d20, d12, d10, d8, d6 or d4
 * @example new Roll("3d6", 1)
 *   .results => [5, 2, 3]
 *   .result => 11
 */
export class Roll {
  readonly faces: number
  readonly results: number[] = []
  readonly result: number = 0
  constructor(dice: string = "1d20", readonly modifier: number = 0) {
    const [quantity, d] = dice.split("d")
    const validDice: Dice[] = [4, 6, 8, 10, 12, 20]
    this.faces = validDice.includes(Number(d)) ? Number(d) : 20
    const length = Number(quantity) ?? 1
    this.results = Array.from({ length }, () => Roll.d(this.faces))
    this.result = this.results.reduce((acc, cur) => acc + cur, 0) + this.modifier
  }

  /** @example Roll.d(20) => 1-20 */
  static d(dice: Dice) {
    return Math.floor(Math.random() * dice) + 1
  }

  /**
   * Return the lower and upper values of a combined roll, with optional modifier
   * @example Roll.minMax("3d6", 1) => [4, 19]
   **/
  static minMax(dice: string, modifier?: number): [number, number] {
    const mod = modifier || 0
    const [min, max] = dice.split("d").map((v, i, a) => (i == 0 ? Number(v) : Number(v) * Number(a[0])))
    return [min + mod, max + mod]
  }
}
