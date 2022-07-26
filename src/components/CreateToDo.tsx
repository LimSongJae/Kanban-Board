import React from "react";
import { useForm } from "react-hook-form";
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";
interface IData {
  toDo: string;
}

const CreateToDo = () => {
  const setToDos = useSetRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IData>();
  const handleValid = ({ toDo }: IData) => {
    setValue("toDo", "");
    setToDos((prev) => [
      ...prev,
      { text: toDo, id: Date.now(), category: "TO_DO" },
    ]);
  };
  return (
    <form onSubmit={handleSubmit(handleValid)}>
      <input
        {...register("toDo", { required: "Please write a to Do" })}
        placeholder="Write a to do"
      />
      <button>Add</button>
    </form>
  );
};

export default CreateToDo;
