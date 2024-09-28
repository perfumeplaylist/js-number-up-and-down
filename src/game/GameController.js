import Model from "./GameLogicModel.js";
import View from "./GameView.js";

export default class GameController {
  constructor(model = new Model(), view = new View()) {
    this.model = model;
    this.view = view;
  }

  async askNumber() {
    const number = parseInt(await this.view.input(`숫자 입력: `), 10);
    this.model.validateNumberInput(number);
  }

  async askIsRetryGame() {
    const reTryValue = await this.view.input(
      "게임을 다시 시작하시겠습니까? (yes/no): "
    );
    this.model.reTryGame(reTryValue);
  }

  async success() {
    const { count } = this.model;
    this.view.success(count);
    return await this.askIsRetryGame();
  }

  async failure() {
    const { randomNumber } = this.model;
    this.view.failure(randomNumber);
    return await this.askIsRetryGame();
  }

  progress() {
    const { inputValue, randomNumber, prevValue } = this.model;
    this.view.progress(inputValue, randomNumber, prevValue);
  }

  errorMessage(errorMessage) {
    this.view.errorMessage(errorMessage);
  }

  start() {
    this.view.start();
    this.model.reset();
  }

  end() {
    this.view.end();
  }
}
