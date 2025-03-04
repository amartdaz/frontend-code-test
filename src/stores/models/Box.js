import { types } from "mobx-state-tree";

const BoxModel = types
  .model("Box", {
    id: types.identifier,
    width: 200,
    height: 100,
    color: "#FFF000",
    left: 200,
    top: 100,
    selected: false,
  })
  .views(self => ({}))
  .actions(self => {
    return {
      select() {
        self.selected = !self.selected;
      },
      setLeft(newLeft) {
        self.left = newLeft
      },
      setTop(newTop) {
        self.top = newTop
      }
    }
  });

export default BoxModel;
