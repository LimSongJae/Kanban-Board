import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface ITODoState {
  [key: string]: ITodo[];
}
export const toDoState = atom<ITODoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
});
