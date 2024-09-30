import CustomError from "../CustomError.js";
import Model from "./GameLogicModel.js";
import View from "./GameView.js";

export default class GameController {
  constructor(model = new Model(), view = new View()) {
    this.model = model;
    this.view = view;
  }

  progress() {
    const { inputValue, randomNumber, prevValue } = this.model;
    this.view.progress(inputValue, randomNumber, prevValue);
  }

  errorMessage(errorMessage) {
    this.view.errorMessage(errorMessage);
  }

  end() {
    this.view.end();
  }

  async askMinMax() {
    this.view.askMinMaxNumber();

    const [min, max] = (await this.view.input("숫자입력: "))
      .split(",")
      .map((num) => parseInt(num, 10));

    this.model.updateMinMaxRandomNumber(min, max);
  }

  async askGameCount() {
    this.view.askGameCountNumber();

    const number = parseInt(await this.view.input("숫자입력: "), 10);

    this.model.updateCountNumber(number);
  }

  async askNumber() {
    const number = parseInt(await this.view.input(`숫자 입력: `), 10);
    const result = this.model.checkAndValidateInput(number);

    if (result && result.isError) {
      const { name, message } = result.error;
      throw new CustomError(name, message);
    } else {
      this.model.updateSuccess(number);
    }
  }

  async askIsRetryGame() {
    const reTryValue = await this.view.input(
      "게임을 다시 시작하시겠습니까? (yes/no): "
    );
    const isRetry = this.model.validateRetry(reTryValue);
    this.model.updateIsReStart(isRetry);
    if (!isRetry) {
      const result = this.model.reTryErrorMessage(reTryValue);
      if (result) throw new CustomError(result.errorName, result.errorMessage);
    }
  }

  async success() {
    const { count } = this.model;
    this.view.success(count);
    await this.askIsRetryGame();
  }

  async exceedProcess() {
    const { randomNumber, limit } = this.model;
    this.view.failure(randomNumber, limit);
    await this.askIsRetryGame();
  }

  successProcess() {
    const isSuccess = this.model.checkSuccess();
    return isSuccess;
  }

  errorType(error) {
    const isThrow = this.model.isThrowErrorMessage(error);
    if (isThrow) throw new CustomError(error.errorName, error.message);
    else this.errorMessage(error.message);
  }

  async main() {
    while (this.model.isDoingGame()) {
      try {
        await this.askNumber();
        const isSuccess = this.successProcess();

        if (isSuccess) {
          await this.success();
          return;
        }

        this.progress();
      } catch (error) {
        this.errorType(error);
        continue;
      }
    }
    await this.exceedProcess();
    return;
  }

  async start() {
    while (this.model.isReStart) {
      try {
        this.model.reset();
        await this.askMinMax();
        await this.askGameCount();
        this.view.start(this.model.min, this.model.max);
        await this.main();
      } catch (error) {
        this.errorMessage(error.message);
      }
    }
    this.end();
  }
}
