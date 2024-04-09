# Dice Roll

#### Dependency free dice roller for table top style gaming rules

The Dice Roll library is a lightweight, dependency-free tool designed to facilitate dice rolling within your projects. Whether you're developing a game, building an application, or creating interactive content, this library simplifies the process of rolling standard table top dice including d4, d6, d8, d12, and d20.

### Features

- Simple syntax for specifying the number and type of dice to roll.
- Roll any quantity of dice, with or without a modifer.
- Get a total result, or an array of results representing each roll.
- Static helpers for min/max, and single roll.
- Lightweight and dependency-free, making it easy to integrate into any project.

### Installation

To use the Dice Roll Library in your project, simply download the provided JavaScript file (dice-roll.js) and include it in your project directory.

```html
<script src="dice-roll.js"></script>
```

```ts
import Roll from "dice-roll"
```

### Usage

Using the Dice Roll Library is straightforward. Simply create a new `Roll` object with the desired dice notation, and call the result. The rolls are executed on contruction of the object and are near instantly available. Trying to roll a non-defined dice will roll a d20 instead, because errors aren't desireable in a simple library. And since the project is TypeScript native, it ships with definitions so the `Dice` definition lists only the valid dice faces of 4, 6, 8, 10, 12 and 20.

1. In this example, `3d6` indicates rolling three six-sided dice. Three rolls are executed on contruction and the results are immediatly available.

```js
// Create a new Roll object with 3d6 notation
const roll = new Roll("3d6")

console.log("Result:", roll.result) // Result: 12
console.log("Results:", roll.results) // Results: [5, 3, 4]
```

2. In this example, we just get the result of the roll directly using the default d20 dice.

```js
// The default Roll is 1d20
const roll = new Roll().result

console.log("Result:", roll) // Result: 17
```

3. In this example, a +2 modifier is added to the result of two twelve-sided dice.

```js
// The modifier is added to the total, not each roll
const roll = new Roll("2d12", 2)

console.log("Result:", roll.result) // Result: 17
console.log("Results:", roll.results) // Results: [8, 7]
```

#### Structure

The resulting object from calling a `new Roll()` contains the following `readonly` properties;

- `result` - the total of the dice rolls, plus the modifier.
- `results` - an array of numbers representing each dice roll.
- `faces` - the number of faces on the dice rolled.
- `modifier` - if defeined, the numeric value added to the results to give the final result. Otherwise `undefined`

#### Helpers

The `Roll` class also has two static helper methods

- `Roll.d(n)` to roll a single dice with `n` faces, and
- `Roll.minMax("3d6")` to calculate and return the minimum and maximum values for the roll, with optional modifier

```js
const roll = Roll.d(20) // 1-20

const [min, max] = Roll.minMax("3d6", 1) // [4, 19]
```

### Contributing

Contributions to the Dice Roll Library are welcome! If you have ideas for improvements, bug fixes, or new features, feel free to open an issue or submit a pull request on our GitHub repository.

### License

The Dice Roll Library is open source and released under the MIT License. See the LICENSE file for details.

For more information, please visit our GitHub repository.

#### Tests

```sh
bun run test
```

```text
src/test/roll.spec.ts:
✓ Roll.d static method > should roll a d20
✓ Roll.d static method > should roll a d6
✓ Roll.minMax static method > should return the minimum and maximum values of a 3d6 roll
✓ Roll.minMax static method > should return the minimum and maximum values of a 3d6 roll with a +5 modifier
✓ Roll.minMax static method > should return the minimum and maximum values of a 2d12 roll with a -2 modifier
✓ Specify a Dice to roll > should roll a d4
✓ Specify a Dice to roll > should roll a d6
✓ Specify a Dice to roll > should roll a d8
✓ Specify a Dice to roll > should roll a d10
✓ Specify a Dice to roll > should roll a d12
✓ Specify a Dice to roll > should roll a d20
✓ A non-specific roll > should roll a d20 (with no arguments)
✓ A non-specific roll > should roll a d20 (for anything but d4, d6, d8, d10, d12 or d20)
✓ Specify a quantity of Dice > should roll 3d6
✓ Specify a quantity of Dice > should roll 3d6 with a +5 modifier
✓ Specify a quantity of Dice > should roll 2d12 with a -2 modifier
✓ Rolling 32d6 > should have a result in the middle third of the mathematical spread
✓ Rolling 32d6 > should have a maximum roll count grater than the minimum roll count
✓ Rolling 32d6 > should have a non-uniform distribution ▄▆▄▄▃▆
✓ Statistical Probability > should randomly distribute a d4 over 64 rolls ▄▃▄▆
✓ Statistical Probability > should have no more than 2 uniform counts
✓ Statistical Probability > should randomly distribute a d4 over 256 rolls ▆▄▃▅
✓ Statistical Probability > should have no more than 2 uniform counts
✓ Statistical Probability > should randomly distribute a d4 over 4096 rolls ▆▄▃▄
✓ Statistical Probability > should have no more than 1 uniform counts
✓ Statistical Probability > should randomly distribute a d4 over 65536 rolls ▃▆▄▄
✓ Statistical Probability > should have no more than 1 uniform counts
✓ Statistical Probability > should randomly distribute a d6 over 64 rolls ▄▅▃▆▄▆
✓ Statistical Probability > should have no more than 3 uniform counts
✓ Statistical Probability > should randomly distribute a d6 over 256 rolls ▅▅▃▅▅▆
✓ Statistical Probability > should have no more than 3 uniform counts
✓ Statistical Probability > should randomly distribute a d6 over 4096 rolls ▅▅▃▃▃▆
✓ Statistical Probability > should have no more than 2 uniform counts
✓ Statistical Probability > should randomly distribute a d6 over 65536 rolls ▆▄▅▅▄▃
✓ Statistical Probability > should have no more than 2 uniform counts
✓ Statistical Probability > should randomly distribute a d8 over 64 rolls ▃▅▆▃▅▆▃▅
✓ Statistical Probability > should have no more than 4 uniform counts
✓ Statistical Probability > should randomly distribute a d8 over 256 rolls ▃▄▆▄▄▃▃▄
✓ Statistical Probability > should have no more than 3 uniform counts
✓ Statistical Probability > should randomly distribute a d8 over 4096 rolls ▃▄▆▅▃▅▆▄
✓ Statistical Probability > should have no more than 2 uniform counts
✓ Statistical Probability > should randomly distribute a d8 over 65536 rolls ▃▄▄▃▃▅▃▆
✓ Statistical Probability > should have no more than 2 uniform counts
✓ Statistical Probability > should randomly distribute a d10 over 64 rolls ▅▅▃▄▄▆▄▄▄▄
✓ Statistical Probability > should have no more than 5 uniform counts
✓ Statistical Probability > should randomly distribute a d10 over 256 rolls ▆▃▄▅▄▄▅▃▅▄
✓ Statistical Probability > should have no more than 4 uniform counts
✓ Statistical Probability > should randomly distribute a d10 over 4096 rolls ▄▆▅▆▅▃▅▄▅▃
✓ Statistical Probability > should have no more than 3 uniform counts
✓ Statistical Probability > should randomly distribute a d10 over 65536 rolls ▄▅▅▄▆▃▄▃▃▄
✓ Statistical Probability > should have no more than 2 uniform counts
✓ Statistical Probability > should randomly distribute a d12 over 64 rolls ▆▃▅▅▃▄▅▄▃▅▄▆
✓ Statistical Probability > should have no more than 6 uniform counts
✓ Statistical Probability > should randomly distribute a d12 over 256 rolls ▄▃▄▄▆▅▄▅▅▃▆▃
✓ Statistical Probability > should have no more than 5 uniform counts
✓ Statistical Probability > should randomly distribute a d12 over 4096 rolls ▃▄▅▄▆▄▃▃▃▄▃▅
✓ Statistical Probability > should have no more than 3 uniform counts
✓ Statistical Probability > should randomly distribute a d12 over 65536 rolls ▄▆▆▆▆▅▄▆▄▃▃▄
✓ Statistical Probability > should have no more than 3 uniform counts
✓ Statistical Probability > should randomly distribute a d20 over 64 rolls ▄▅▃▆▆▅▅▆▄▆▅▄▅▅▅▅▅▅▅▄
✓ Statistical Probability > should have no more than 10 uniform counts
✓ Statistical Probability > should randomly distribute a d20 over 256 rolls ▄▆▅▄▅▄▄▄▅▅▄▅▆▄▅▄▄▄▅▃
✓ Statistical Probability > should have no more than 8 uniform counts
✓ Statistical Probability > should randomly distribute a d20 over 4096 rolls ▃▅▅▅▆▄▄▄▃▅▄▅▅▅▄▅▅▅▄▅
✓ Statistical Probability > should have no more than 5 uniform counts
✓ Statistical Probability > should randomly distribute a d20 over 65536 rolls ▅▅▄▃▄▃▃▅▃▅▆▅▄▆▄▄▆▅▅▄
✓ Statistical Probability > should have no more than 4 uniform counts
--------------|---------|---------|-------------------
File          | % Funcs | % Lines | Uncovered Line #s
--------------|---------|---------|-------------------
All files     |  100.00 |  100.00 |
 src/dice.ts  |  100.00 |  100.00 |
 src/index.ts |  100.00 |  100.00 |
 src/roll.ts  |  100.00 |  100.00 |
--------------|---------|---------|-------------------

 67 pass
 0 fail
 572 expect() calls
Ran 67 tests across 1 files. [34.00ms]
```
