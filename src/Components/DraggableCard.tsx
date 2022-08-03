import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { saveToDos, StorageKey, toDoState } from "../atoms";

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
interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  const [toDo, setToDo] = useRecoilState(toDoState);

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
          <button>수정</button>
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
