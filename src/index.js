import View from "./game/GameView.js";
import Model from "./game/GameLogicModel.js";
import Game from "./game/GameController.js";

(async function init(view, model) {
  const game = new Game(model, view);
  await game.start();
})(new View(), new Model());
