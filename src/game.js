import CONSTANT from "./constant.js";
import validation from "./validation.js";

async function reTryGame(view, model) {
  const retryValue = await view.input(
    "게임을 다시 시작하시겠습니까? (yes/no): "
  );
  const isRetry = validation.main("retry", retryValue);
  model.updateIsReStart(isRetry);
  !isRetry &&
    !validation.validateInput(retryValue, CONSTANT.MESSAGE.NO) &&
    view.errorMessage("입력한 형식이 잘못 되었습니다.");
}

async function play(view, model) {
  view.start();
  model.reset();

  while (model.count < CONSTANT.NUMBER.LIMIT_COUNT) {
    const inputValue = parseInt(await view.input("숫자 입력: "), 10);
    if (validation.main("number", inputValue, model.prevValue)) {
      validation.sameValidation(inputValue, model.prevValue)
        ? view.errorMessage("동일한 값을 입력하였습니다.다시 입력해주세요")
        : view.errorMessage("입력 형식이 잘못되었습니다.다시 입력해주세요");
      continue;
    }
    model.updateInputValue(inputValue);
    model.updatePrevValue([...model.prevValue, model.inputValue]);
    model.updateCount(model.count + 1);
    if (validation.isSameValue(model.inputValue, model.randomNumber)) {
      view.success(model.count);
      await reTryGame(view, model);
      return;
    }
    view.progress(model.inputValue, model.randomNumber, model.prevValue);
  }
  view.failure(model.randomNumber);
  await reTryGame(view, model);
  return;
}

export default play;
