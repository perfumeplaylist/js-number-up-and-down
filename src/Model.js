import CONSTANT from "./constant.js";

export default class Model {
  constructor() {
    this.count = 0;
    this.prevValue = [];
    this.randomNumber = 0;
    this.isReStart = true;
    this.inputValue = null;
  }

  #getRandomNumber() {
    return Math.floor(Math.random() * CONSTANT.NUMBER.MAX_NUMBER) + 1;
  }

  updateCount(count) {
    this.count = count;
  }

  updatePrevValue(value) {
    this.prevValue = value;
  }

  updateIsReStart(value) {
    this.isReStart = value;
  }

  updateInputValue(value) {
    this.inputValue = value;
  }

  setRandomNumber() {
    this.randomNumber = this.#getRandomNumber();
  }

  reset() {
    this.count = 0;
    this.prevValue = [];
    this.setRandomNumber();
    this.isReStart = true;
  }
}
