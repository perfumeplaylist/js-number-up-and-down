import readline from "readline";
import CONSTANT from "../constant.js";

export default class GameView {
  #printMessage(message) {
    console.log(message);
  }

  #readLineAsync(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        if (!answer.length) {
          rl.close();
          this.#printMessage("입력이 비어있습니다. 다시 입력해주세요.");
          return resolve(this.#readLineAsync(query));
        }
        resolve(answer);
        rl.close();
      });
    });
  }

  askMinMaxNumber() {
    this.#printMessage(
      "[게임 설정] 게임 시작을 위해 최소 값, 최대 값을 입력해주세요. (예: 1, 50)"
    );
  }

  askGameCountNumber() {
    this.#printMessage(
      "[게임 설정] 게임 시작을 위해 진행 가능 횟수를 입력해주세요."
    );
  }

  start(min, max) {
    this.#printMessage(
      `컴퓨터가 ${min}~${max} 사이의 숫자를 선택했습니다. 숫자를 맞춰보세요.`
    );
  }

  async input(message) {
    return await this.#readLineAsync(message);
  }

  progress(inputValue, randomNumber, prevValues) {
    this.#printMessage(
      inputValue > randomNumber ? CONSTANT.MESSAGE.DOWN : CONSTANT.MESSAGE.UP
    );
    this.#printMessage(`이전 추측: ${prevValues.join(", ")}`);
  }

  success(count) {
    this.#printMessage("정답!");
    this.#printMessage(`축하합니다! ${count}번 만에 숫자를 맞추셨습니다.`);
  }

  failure(randomNumber, limit) {
    this.#printMessage(
      `${limit}회 초과! 숫자를 맞추지 못했습니다. (정답: ${randomNumber})`
    );
  }

  end() {
    this.#printMessage("게임을 종료합니다.");
  }

  errorMessage(message) {
    this.#printMessage(message);
  }
}
