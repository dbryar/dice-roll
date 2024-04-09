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
  static minMax(dice: string, modifier: number = 0): [number, number] {
    const mod = modifier
    const [min, max] = dice.split("d").map((v, i, a) => (i == 0 ? Number(v) : Number(v) * Number(a[0])))
    return [min + mod, max + mod]
  }

  /** return the lowest result in the set */
  min(): number {
    return Math.min(...this.results)
  }

  /** return the highest result in the set */
  max(): number {
    return Math.max(...this.results)
  }

  /**
   * return a count of each result in the set
   * @param where - filter the results by a face, or a condition
   * @example new Roll("3d6").count() => { 1: 2, 2: 0, 3: 0, 4: 1, 5: 1, 6: 0 }
   * @example new Roll("3d6").count(4) => 1
   * @example new Roll("3d6").count(">3") => 2
   **/
  count(where?: number | string) {
    const count: number[] = this.results.reduce((acc, v) => {
      acc[v - 1]++
      return acc
    }, Array(this.faces).fill(0))
    const faceCount = count.reduce((acc, cur, i) => ({ ...acc, [i + 1]: cur }), {} as Record<number, number>)
    return where === undefined ? faceCount : typeof where == "number" ? faceCount[where] ?? 0 : this.where(where).results.length
  }

  /**
   * return a new Roll with a filtered result set where the condition is met
   * @example new Roll("3d6").where(">3").results => [5, 4]
   * @example new Roll("3d6").where("=6").results => []
   * @example new Roll("3d6").where(">2").where("<5").results => [4]
   **/
  where(where: string): Roll {
    const [_, op, val] = where.match(/([><=]+)?(\d+)/) ?? []
    const fn = (a: number, b: number) => eval(`${a} ${!op || op == "=" ? "==" : op} ${b}`)
    const results = this.results.filter((r) => fn(r, Number(val)))
    const result = results.reduce((acc, cur) => acc + cur, 0) + this.modifier
    return { ...this, results, result, min: this.min, max: this.max, count: this.count, where: this.where }
  }
}
