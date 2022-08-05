import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { saveToDos, toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? "tomato" : props.theme.cardColor};
  padding: 10px 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
  position: relative;
`;

const DeleteBtn = styled.button`
  position: absolute;
  right: 5px;
`;

const ModifyInput = styled.input<{ toggle: boolean }>`
  display: ${({ toggle }) => (toggle ? "block" : "none")};
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

interface IForm {
  modify: string;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  const [toDo, setToDo] = useRecoilState(toDoState);
  const [modifyToggleBtn, setModifyToggleBtn] = useState(false);
  const { register, handleSubmit } = useForm<IForm>();

  useEffect(() => {
    saveToDos(toDo);
  }, [toDo]);

  const deleteTodo = (index: number) => {
    setToDo((prev) => {
      const newToDo = [...prev[boardId]];
      newToDo.splice(index, 1);
      return { ...prev, [boardId]: newToDo };
    });
  };

  const onValid = ({ modify }: IForm) => {
    const toDo = { id: Date.now(), text: modify };
    setToDo((prev) => {
      const newToDo = [...prev[boardId]];
      newToDo.splice(index, 1, toDo);
      return {
        ...prev,
        [boardId]: newToDo,
      };
    });
  };

  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {toDoText}
          <button
            onClick={() => {
              setModifyToggleBtn((prev) => !prev);
            }}
          >
            {!modifyToggleBtn ? "수정" : "x"}
          </button>
          <form onSubmit={handleSubmit(onValid)}>
            <ModifyInput
              {...register("modify", { required: true })}
              type="text"
              toggle={modifyToggleBtn}
              placeholder="sd"
            />
          </form>

          <DeleteBtn
            onClick={() => {
              deleteTodo(index);
            }}
          >
            삭제
          </DeleteBtn>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
