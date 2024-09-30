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

  async askNumber() {
    const number = parseInt(await this.view.input(`숫자 입력: `), 10);
    const {
      isError,
      error: { name, message },
    } = this.model.checkAndValidateInput(number);
    if (isError) {
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
      const { errorName, errorMessage } =
        this.model.reTryErrorMessage(reTryValue);
      throw new CustomError(errorName, errorMessage);
    }
  }

  async success() {
    const { count } = this.model;
    this.view.success(count);
    await this.askIsRetryGame();
  }

  async exceedProcess() {
    const { randomNumber } = this.model;
    this.view.failure(randomNumber);
    await this.askIsRetryGame();
  }

  successProcess() {
    const isSuccess = this.model.checkSuccess();
    return isSuccess;
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
        this.model.isThrowErrorMessage(error);
        this.errorMessage(error.message);
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
        this.view.start();
        await this.main();
      } catch (error) {
        this.errorMessage(error.message);
      }
    }
    this.end();
  }
}
