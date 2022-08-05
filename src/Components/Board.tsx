import { useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, saveToDos, toDoState } from "../atoms";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding: 10px 0px;
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;
interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

const DelBoard = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
`;
interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const [toDo, setToDos] = useRecoilState(toDoState);

  useEffect(() => {
    saveToDos(toDo);
  }, [toDo]);

  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((prev) => {
      const newToDos = {
        ...prev,
        [boardId]: [newToDo, ...prev[boardId]],
      };
      return newToDos;
    });
    setValue("toDo", "");
  };
  const { register, setValue, handleSubmit } = useForm<IForm>();
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <DelBoard
        onClick={() => {
          setToDos((prev) => {
            const newToDo = { ...prev };
            delete newToDo[boardId];

            return newToDo;
          });
        }}
      >
        삭제
      </DelBoard>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type={`text`}
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            isDraggingOver={snapshot.isDraggingOver}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {provided.placeholder}
            <button
              onClick={() => {
                setToDos((prev) => {
                  return { ...prev, [boardId]: [] };
                });
              }}
            >
              전체 삭제
            </button>
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
