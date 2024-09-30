import CONSTANT from "../constant.js";
import validation from "../validation.js";

// 여기서는 비지니스 로직 작성
// 기능 추상화가 아니라 동작 추상화 생각

export default class GameLogicModel {
  constructor() {
    this.count = 0;
    this.limit = 0;
    this.min = 0;
    this.max = 0;
    this.randomNumber = 0;
    this.prevValue = [];
    this.isReStart = true;
    this.inputValue = null;
  }

  #getRandomNumber() {
    return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
  }

  #updateCount(count) {
    this.count = count;
  }

  #updatePrevValue(value) {
    this.prevValue = value;
  }

  updateIsReStart(value) {
    this.isReStart = value;
  }

  #updateInputValue(value) {
    this.inputValue = value;
  }

  #updateMinNumber(value) {
    this.min = value;
  }
  #updateMaxNumber(value) {
    this.max = value;
  }

  updateCountNumber(value) {
    this.limit = value;
  }

  updateSuccess(number) {
    this.#updateInputValue(number);
    this.#updatePrevValue([...this.prevValue, number]);
    this.#updateCount(this.count + 1);
  }

  updateMinMaxRandomNumber(min, max) {
    this.#updateMinNumber(min);
    this.#updateMaxNumber(max);
    this.randomNumber = this.#getRandomNumber();
  }

  isDoingGame() {
    return this.count < this.limit;
  }

  checkSuccess() {
    const isSame = validation.isSameValue(this.inputValue, this.randomNumber);
    return isSame;
  }

  validateRetry(retryValue) {
    const isRetry = validation.validateInput(retryValue, CONSTANT.MESSAGE.YES);
    return isRetry;
  }

  reTryErrorMessage(inputValue) {
    if (!validation.validateInput(inputValue, CONSTANT.MESSAGE.NO)) {
      return {
        errorName: CONSTANT.ID.RETRY,
        errorMessage: "입력 형식이 잘못되었습니다.",
      };
    }
  }

  checkAndValidateInput(number) {
    const isError =
      validation.sameValidation(number, this.prevValue) ||
      validation.numberValidation(number, this.min, this.max);

    const errorMessage = validation.sameValidation(number, this.prevValue)
      ? "동일한 값을 입력하였습니다. 다시 입력해주세요"
      : "입력 형식이 잘못되었습니다. 다시 입력해주세요";

    return isError
      ? { isError, error: { name: CONSTANT.ID.NUMBER, message: errorMessage } }
      : false;
  }

  isThrowErrorMessage(error) {
    return error.errorName === CONSTANT.ID.RETRY;
  }

  reset() {
    this.count = 0;
    this.limit = 0;
    this.min = 0;
    this.max = 0;
    this.prevValue = [];
    this.isReStart = true;
  }
}
