// src/dice.ts
var Dice;
(function(Dice2) {
  Dice2[Dice2["d4"] = 4] = "d4";
  Dice2[Dice2["d6"] = 6] = "d6";
  Dice2[Dice2["d8"] = 8] = "d8";
  Dice2[Dice2["d10"] = 10] = "d10";
  Dice2[Dice2["d12"] = 12] = "d12";
  Dice2[Dice2["d20"] = 20] = "d20";
})(Dice || (Dice = {}));

// src/roll.ts
class Roll {
  modifier;
  dice;
  results = [];
  result = 0;
  constructor(dice = "1d20", modifier = 0) {
    this.modifier = modifier;
    const [quantity, d] = dice.split("d");
    const validDice = [4, 6, 8, 10, 12, 20];
    this.dice = validDice.includes(Number(d)) ? Number(d) : 20;
    let rolls = Number(quantity) ?? 1;
    while (--rolls >= 0) {
      this.results.push(Roll.d(this.dice));
    }
    this.result = this.results.reduce((acc, cur) => acc + cur, 0) + this.modifier;
  }
  static d(dice) {
    return Math.floor(Math.random() * dice) + 1;
  }
  static minMax(dice, modifier) {
    const mod = modifier || 0;
    const [min, max] = dice.split("d").map((v, i, a) => i == 0 ? Number(v) : Number(v) * Number(a[0]));
    return [min + mod, max + mod];
  }
}

// src/index.ts
var src_default = Roll;
export {
  src_default as default,
  Roll,
  Dice
};
