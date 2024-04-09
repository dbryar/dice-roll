import { describe, it, expect } from "bun:test"
import Roll, { Dice } from ".."

const roller = (dice: Dice, rolls: number) => {
  const results: number[] = new Array(dice).fill(0)
  while (--rolls >= 0) {
    results[Roll.d(dice) - 1]++
  }
  return results
}

const visual = (results: number[]) => {
  const upper = Math.max(...results)
  const lower = Math.min(...results)
  const low = "\u2583"
  const some = "\u2584"
  const many = "\u2585"
  const high = "\u2586"
  return results.map((r) => [low, some, many, high][Math.round(((r - lower) / (upper - lower)) * 3)]).join("")
}

describe("Roll.d static method", () => {
  it("should roll a d20", () => {
    const roll = Roll.d(20)
    expect(typeof roll).toBe("number")
    expect(roll).toBeGreaterThanOrEqual(1)
    expect(roll).toBeLessThanOrEqual(20)
  })

  it("should roll a d6", () => {
    const roll = Roll.d(6)
    expect(typeof roll).toBe("number")
    expect(roll).toBeGreaterThanOrEqual(1)
    expect(roll).toBeLessThanOrEqual(6)
  })
})

describe("Roll.minMax static method", () => {
  it("should return the minimum and maximum values of a 3d6 roll", () => {
    expect(Roll.minMax("3d6")).toEqual([3, 18])
  })

  it("should return the minimum and maximum values of a 3d6 roll with a +5 modifier", () => {
    expect(Roll.minMax("3d6", 5)).toEqual([8, 23])
  })

  it("should return the minimum and maximum values of a 2d12 roll with a -2 modifier", () => {
    expect(Roll.minMax("2d12", -2)).toEqual([0, 22])
  })
})

describe("Specify a Dice to roll", () => {
  it("should roll a d4", () => {
    const roll = new Roll("1d4")
    expect(roll.result).toBeGreaterThanOrEqual(1)
    expect(roll.result).toBeLessThanOrEqual(4)
  })

  it("should roll a d6", () => {
    const roll = new Roll("1d6")
    expect(roll.result).toBeGreaterThanOrEqual(1)
    expect(roll.result).toBeLessThanOrEqual(6)
  })

  it("should roll a d8", () => {
    const roll = new Roll("1d8")
    expect(roll.result).toBeGreaterThanOrEqual(1)
    expect(roll.result).toBeLessThanOrEqual(8)
  })

  it("should roll a d10", () => {
    const roll = new Roll("1d10")
    expect(roll.result).toBeGreaterThanOrEqual(1)
    expect(roll.result).toBeLessThanOrEqual(10)
  })

  it("should roll a d12", () => {
    const roll = new Roll("1d12")
    expect(roll.result).toBeGreaterThanOrEqual(1)
    expect(roll.result).toBeLessThanOrEqual(12)
  })

  it("should roll a d20", () => {
    const roll = new Roll("1d20")
    expect(roll.result).toBeGreaterThanOrEqual(1)
    expect(roll.result).toBeLessThanOrEqual(20)
  })
})

describe("A non-specific roll", () => {
  it("should roll a d20 (with no arguments)", () => {
    const roll = new Roll()
    expect(roll.result).toBeGreaterThanOrEqual(1)
    expect(roll.result).toBeLessThanOrEqual(20)
  })

  it("should roll a d20 (for anything but d4, d6, d8, d10, d12 or d20)", () => {
    const results = Array.from({ length: 128 }, () => new Roll("1d7").result)
    expect(Math.max(...results)).toEqual(20)
  })
})

describe("Specify a quantity of Dice", () => {
  it("should roll 3d6", () => {
    const roll = new Roll("3d6")
    expect(roll.results).toHaveLength(3)
    expect(roll.result).toBeGreaterThanOrEqual(3)
    expect(roll.result).toBeLessThanOrEqual(18)
    roll.results.forEach((r) => {
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(6)
    })
  })

  it("should roll 3d6 with a +5 modifier", () => {
    const roll = new Roll("3d6", 5)
    expect(roll.results).toHaveLength(3)
    expect(roll.result).toBeGreaterThanOrEqual(9)
    expect(roll.result).toBeLessThanOrEqual(23)
    roll.results.forEach((r) => {
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(6)
    })
    expect(roll.modifier).toBe(5)
  })

  it("should roll 2d12 with a -2 modifier", () => {
    const roll = new Roll("2d12", -2)
    expect(roll.results).toHaveLength(2)
    expect(roll.result).toBeGreaterThanOrEqual(0)
    expect(roll.result).toBeLessThanOrEqual(22)
    roll.results.forEach((r) => {
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(12)
    })
    expect(roll.modifier).toBe(-2)
  })
})

describe("Rolling 32d6", () => {
  const roll = new Roll("32d6")
  const distribution: number[] = roll.results.reduce((acc, cur) => {
    acc[cur - 1]++
    return acc
  }, new Array(6).fill(0))

  it("should have a result in the middle third of the mathematical spread", () => {
    expect(roll.results).toHaveLength(32)
    expect(roll.result).toBeGreaterThanOrEqual(84)
    expect(roll.result).toBeLessThanOrEqual(140)
  })

  it("should have a maximum roll count grater than the minimum roll count", () => {
    expect(Math.min(...distribution)).toBeLessThan(Math.max(...distribution))
  })

  it(`should have a non-uniform distribution ${visual(distribution)}`, () => {
    expect(distribution.filter((v, i, a) => a.indexOf(v) === i).length).toBeGreaterThan(2)
    distribution.map((v) => {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(12)
    })
  })
})

describe("Statistical Probability", () => {
  ;[4, 6, 8, 10, 12, 20].map((dice) => {
    ;[6, 8, 12, 16].map((r) => {
      const rolls = Math.pow(2, r)
      const results = roller(dice, rolls)
      const uniform = rolls / dice
      const max = Math.ceil(dice + uniform * Math.sqrt(2))
      const min = Math.floor((uniform * Math.sqrt(2)) / 2 - dice)
      const uniMax = Math.ceil((3 * dice) / r)

      it(`should randomly distribute a d${dice} over ${rolls} rolls ${visual(results)}`, () => {
        results.map((roll) => {
          expect(roll).toBeGreaterThanOrEqual(min)
          expect(roll).toBeLessThanOrEqual(max)
        })
      })

      it(`should have no more than ${uniMax} uniform counts`, () => {
        expect(results.filter((r) => r == Math.round(uniform)).length).toBeLessThanOrEqual(uniMax)
      })
    })
  })
})
