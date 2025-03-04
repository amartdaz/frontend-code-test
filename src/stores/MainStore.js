import { types } from "mobx-state-tree";
import uuid from "uuid/v4";
import BoxModel from "./models/Box";
import getRandomColor from "../utils/getRandomColor";

const MainStore = types
  .model("MainStore", {
    boxes: types.array(BoxModel),
  })
  .actions(self => {
    return {
      addBox(box) {
        self.boxes.push(box);
      },
      removeBoxes() {
        const selectedBoxes = self.boxes.filter(box => box.selected);
        selectedBoxes.length > 0 ? selectedBoxes.forEach(box => {
          self.boxes.remove(box);
        }) : self.boxes.pop();
      },
      selectBox(boxId) {
        const selectedBox = self.boxes.filter(box => box.id === boxId)[0];
        selectedBox.select();
      },
      getSelectedBoxes() {
        const selectedBoxes = self.boxes.filter(box => box.selected);
        return selectedBoxes.length;
      },
      changeColor(newColor) {
        const selectedBoxes = self.boxes.filter(box => box.selected);
        selectedBoxes.length > 0 ? selectedBoxes.forEach(box => {
          box.color = newColor;
        }) : self.boxes.at(-1).color = newColor;
      }
    };
  })
  .views(self => ({
    get selectedBoxes() {
      const selected = self.boxes.filter(box => box.selected === true);
      return selected.length;
    },
    get countBoxes() {
      return self.boxes.length;
    }
}));

const localStorage = window.localStorage.getItem("store");

const box1 = BoxModel.create({
  id: uuid(),
  color: getRandomColor(),
  left: 0,
  top: 0
});

const store = localStorage ? MainStore.create(JSON.parse(localStorage)) : MainStore.create({boxes: [box1], random: true});

export default store;
