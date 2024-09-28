import CONSTANT from "./constant.js";
import CustomError from "./CustomError.js";
import validation from "./validation.js";

export default class Model {
  constructor() {
    this.count = 0;
    this.prevValue = [];
    this.randomNumber = 0;
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

  reTryGame(retryValue) {
    const isRetry = validation.main("retry", retryValue);
    this.#updateIsReStart(isRetry);
    !isRetry && this.reTryErrorMessage(retryValue);
  }

  reTryErrorMessage(inputValue) {
    if (!validation.validateInput(inputValue, CONSTANT.MESSAGE.NO)) {
      throw new CustomError("retry", "입력 형식이 잘못되었습니다.");
    }
  }

  sameErrorMessage(inputValue) {
    if (validation.sameValidation(inputValue, this.prevValue)) {
      throw new CustomError(
        "isSame",
        "동일한 값을 입력하였습니다.다시 입력해주세요"
      );
    } else {
      throw new CustomError(
        "isSame",
        "입력 형식이 잘못되었습니다.다시 입력해주세요"
      );
    }
  }

  async main() {
    while (this.count < CONSTANT.NUMBER.LIMIT_COUNT) {
      try {
        const number = await this.game.askNumber();

        // 여기서는 같은 수가 있는지 확인

        if (validation.main("number", number, this.prevValue)) {
          this.sameErrorMessage(number);
        }

        this.#updateInputValue(number);
        this.#updatePrevValue([...this.prevValue, number]);
        this.#updateCount(this.count + 1);

        if (validation.isSameValue(this.inputValue, this.randomNumber)) {
          const retryValue = await this.game.success();
          this.reTryGame(retryValue);
          return;
        }

        this.game.progress();
      } catch (error) {
        if (error.errorName === "retry") throw new Error(error.message);
        this.game.errorMessage(error.message);
        continue;
      }
    }
    const retryValue = await this.game.failure();
    this.reTryGame(retryValue);
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
