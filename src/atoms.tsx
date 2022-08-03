import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface ITODoState {
  [key: string]: ITodo[];
}

export const loadToDos = () => {
  const localToDos = localStorage.getItem(StorageKey);
  if (localToDos) {
    return JSON.parse(localToDos);
  }
  return null;
};

export const defaultToDos: ITODoState = {
  Todo: [],
  Doing: [],
  Done: [],
};
export const StorageKey = "TODO";

export const toDoState = atom<ITODoState>({
  key: "toDo",
  default: loadToDos() ?? defaultToDos,
});

export const modalState = atom({
  key: "modal",
  default: false,
});

export const saveToDos = (toDos: ITODoState) => {
  localStorage.setItem(StorageKey, JSON.stringify(toDos));
};
