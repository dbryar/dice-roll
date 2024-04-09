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
  const some = "\u2585"
  const many = "\u2586"
  const high = "\u2587"
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

describe("Min/Max results", () => {
  it("should return the minimum roll from the set of 4d6", () => {
    const roll = new Roll("4d6")
    const expected = roll.results.sort((a, b) => a - b)[0]
    expect(roll.min()).toEqual(expected)
  })

  it("should return the maximum roll from the set of 4d6", () => {
    const roll = new Roll("4d6")
    const expected = roll.results.sort((a, b) => b - a)[0]
    expect(roll.max()).toEqual(expected)
  })
})

describe("Counting results of 10d6", () => {
  const roll = new Roll("10d6")
  const counts = roll.count()

  it.each([1, 2, 3, 4, 5, 6])(`should count each of the '%d' results`, (face) => {
    const count = roll.results.filter((r) => r == face).length
    expect(counts).toHaveProperty(String(face), count)
  })

  it.each([1, 2, 3, 4, 5, 6])("should be able to directly access a count for face '%d'", (face) => {
    const count = roll.results.filter((r) => r == face).length
    expect(counts[face]).toEqual(count)
    expect(roll.count(face)).toEqual(count)
  })

  it("should return a count of zero for a non-existent face", () => {
    expect(roll.count(7)).toEqual(0)
  })
})

describe("Filtering results", () => {
  const roll = new Roll("24d6", -5)
  const results = roll.results
  it("should filter results where the roll is greater than 3", () => {
    const expected = results.filter((r) => r > 3)
    const min = Math.min(...expected)
    const max = Math.max(...expected)

    const output = roll.where(">3")

    expect(output.results).toHaveLength(expected.length)
    expect(output.min()).toEqual(min)
    expect(output.max()).toEqual(max)
  })

  it("should filter results where the roll is equal to 6", () => {
    const expected = results.filter((r) => r == 6)
    const [min, max] = [6, 6]

    const output = roll.where("=6")

    expect(output.results).toHaveLength(expected.length)
    expect(output.min()).toEqual(min)
    expect(output.max()).toEqual(max)
  })

  it("should filter results where the roll is less than or equal to 5", () => {
    const expected = results.filter((r) => r <= 5)
    const min = Math.min(...expected)
    const max = Math.max(...expected)

    const output = roll.where("<=5")

    expect(output.results).toHaveLength(expected.length)
    expect(output.min()).toEqual(min)
    expect(output.max()).toEqual(max)
  })

  it("should filter results where the roll is greater than 3 and less than 5", () => {
    const expected = results.filter((r) => r > 3 && r < 5)
    const min = Math.min(...expected)
    const max = Math.max(...expected)

    const output = roll.where(">3").where("<5")

    expect(output.results).toHaveLength(expected.length)
    expect(output.min()).toEqual(min)
    expect(output.max()).toEqual(max)
  })

  it("should filter the results and return a new sum result using the original modifier", () => {
    const expected = results.filter((r) => r > 3 && r < 5)
    const result = expected.reduce((acc, cur) => acc + cur, 0) - 5

    const output = roll.where(">3").where("<5")

    expect(output.result).toEqual(result)
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

      it(
        `should randomly distribute a d${dice} over ${rolls} rolls ${visual(results)}`,
        () => {
          results.map((roll) => {
            expect(roll).toBeGreaterThanOrEqual(min)
            expect(roll).toBeLessThanOrEqual(max)
          })
        },
        { retry: 2 }
      )

      it(`should have no more than ${uniMax} uniform counts`, () => {
        expect(results.filter((r) => r == Math.round(uniform)).length).toBeLessThanOrEqual(uniMax)
      })
    })
  })
})
