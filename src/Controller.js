import Model from "./Model.js";
import View from "./View.js";

export default class Game {
  constructor(model = new Model(), view = new View()) {
    this.model = model;
    this.view = view;
  }

  async askNumber() {
    // 상태를 업데이트 하는 로직 추가
    // 실패를 한다면 상태를 초기화 시키는 로직 추가
    // 숫자가 입력되었는지 정합성 검사

    return parseInt(await this.view.input(`숫자 입력: `), 10);
  }

  async askIsRetryGame() {
    // 바로 입력한 후에 상태 정의까지 하는게 깔끔해보인다.
    return await this.view.input("게임을 다시 시작하시겠습니까? (yes/no): ");
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
    // 초기화 로직 정의
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
