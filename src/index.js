import View from "./View.js";
import Model from "./Model.js";
import play from "./Game.js";

(async function init(view, model) {
  while (model.isReStart) {
    await play(view, model);
  }
  view.end();
})(new View(), new Model());
