import CONSTANT from "../constant.js";
import CustomError from "../CustomError.js";
import validation from "../validation.js";

// 여기서는 비지니스 로직 작성
// 기능 추상화가 아니라 동작 추상화 생각

export default class GameLogicModel {
  constructor() {
    this.count = 0;
    this.randomNumber = 0;
    this.prevValue = [];
    this.isReStart = true;
    this.inputValue = null;
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

  updateIsReStart(value) {
    this.isReStart = value;
  }

  #updateInputValue(value) {
    this.inputValue = value;
  }

  updateSuccess(number) {
    this.#updateInputValue(number);
    this.#updatePrevValue([...this.prevValue, number]);
    this.#updateCount(this.count + 1);
  }

  isDoingGame() {
    return this.count < CONSTANT.NUMBER.LIMIT_COUNT;
  }

  checkSuccess() {
    const isSame = validation.isSameValue(this.inputValue, this.randomNumber);
    return isSame;
  }

  validateRetry(retryValue) {
    const isRetry = validation.main(CONSTANT.ID.RETRY, retryValue);
    return isRetry;
  }

  reTryErrorMessage(inputValue) {
    // 에러를 던져주는게 아니라 controller에서 처리하도록 해야한다.
    // 즉 여기서는 비지니스 로직만 작성하여 상태를 업데이트 하거나 해당 동작만 수행하도록 해야한다
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
      validation.main(CONSTANT.ID.NUMBER, number, this.prevValue);

    const errorMessage = validation.sameValidation(number, this.prevValue)
      ? "동일한 값을 입력하였습니다. 다시 입력해주세요"
      : "입력 형식이 잘못되었습니다. 다시 입력해주세요";

    return isError
      ? { isError, error: { name: CONSTANT.ID.NUMBER, message: errorMessage } }
      : false;
  }

  isThrowErrorMessage(error) {
    if (error.errorName === CONSTANT.ID.RETRY) throw new CustomError(...error);
  }

  reset() {
    this.count = 0;
    this.prevValue = [];
    this.randomNumber = this.#getRandomNumber();
    this.isReStart = true;
  }
}
