import CONSTANT from "./constant.js";
import CustomError from "./CustomError.js";
import validation from "./validation.js";

export default class Model {
  constructor() {
    this.count = 0;
    this.randomNumber = 0;
    this.prevValue = [];
    this.isReStart = true;
    this.inputValue = null;
    this.game = null;
  }

  #getRandomNumber() {
    return Math.floor(Math.random() * CONSTANT.NUMBER.MAX_NUMBER) + 1;
  }

  #updateCount(count) {
    this.count = count;
  }

  #updatePrevValue(value) {
    this.prevValue = value;
  }

  #updateIsReStart(value) {
    this.isReStart = value;
  }

  #updateInputValue(value) {
    this.inputValue = value;
  }

  validateNumberInput(number) {
    if (validation.main(CONSTANT.ID.NUMBER, number, this.prevValue)) {
      this.sameErrorMessage(number);
    }
    this.#updateInputValue(number);
  }

  reTryGame(retryValue) {
    const isRetry = validation.main(CONSTANT.ID.RETRY, retryValue);
    this.#updateIsReStart(isRetry);
    !isRetry && this.reTryErrorMessage(retryValue);
  }

  reTryErrorMessage(inputValue) {
    if (!validation.validateInput(inputValue, CONSTANT.MESSAGE.NO)) {
      throw new CustomError(CONSTANT.ID.RETRY, "입력 형식이 잘못되었습니다.");
    }
  }

  sameErrorMessage(inputValue) {
    if (validation.sameValidation(inputValue, this.prevValue)) {
      throw new CustomError(
        CONSTANT.ID.NUMBER,
        "동일한 값을 입력하였습니다.다시 입력해주세요"
      );
    } else {
      throw new CustomError(
        CONSTANT.ID.NUMBER,
        "입력 형식이 잘못되었습니다.다시 입력해주세요"
      );
    }
  }

  async main() {
    while (this.count < CONSTANT.NUMBER.LIMIT_COUNT) {
      try {
        await this.game.askNumber();

        this.#updatePrevValue([...this.prevValue, this.inputValue]);
        this.#updateCount(this.count + 1);

        if (validation.isSameValue(this.inputValue, this.randomNumber)) {
          await this.game.success();
          return;
        }

        this.game.progress();
      } catch (error) {
        if (error.errorName === CONSTANT.ID.RETRY)
          throw new CustomError(error.message);
        this.game.errorMessage(error.message);
        continue;
      }
    }
    await this.game.failure();
    return;
  }

  async start(controller) {
    this.game = controller;
    while (this.isReStart) {
      try {
        this.game.start();
        await this.main();
      } catch (error) {
        this.game.errorMessage(error.message);
      }
    }
    this.game.end();
  }

  reset() {
    this.count = 0;
    this.prevValue = [];
    this.randomNumber = this.#getRandomNumber();
    this.isReStart = true;
  }
}
