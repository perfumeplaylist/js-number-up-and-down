import View from "./View.js";
import Model from "./Model.js";
import Game from "./Controller.js";

(async function init(view, model) {
  const game = new Game(model, view);
  await model.start(game);
})(new View(), new Model());
