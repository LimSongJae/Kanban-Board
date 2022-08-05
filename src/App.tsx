import { useEffect } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { modalState, saveToDos, toDoState } from "./atoms";
import Board from "./Components/Board";
import Modal from "./Components/Modal";

const Boards = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const BoardBtn = styled.button`
  position: absolute;
  right: 5px;
  top: 5px;
`;

function App() {
  const setModal = useSetRecoilState(modalState);
  const [toDos, setToDos] = useRecoilState(toDoState);

  useEffect(() => {
    saveToDos(toDos);
  }, [toDos]);

  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board
      setToDos((prev) => {
        const toDosCopy = [...prev[source.droppableId]];
        const tempToDos = toDosCopy[source.index];
        toDosCopy.splice(source.index, 1);
        toDosCopy.splice(destination.index, 0, tempToDos);
        const newToDos = {
          ...prev,
          [source.droppableId]: toDosCopy,
        };

        return newToDos;
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board
      setToDos((prev) => {
        const sourceBoard = [...prev[source.droppableId]];
        const tempToDos = sourceBoard[source.index];
        const destinationBoard = [...prev[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, tempToDos);
        const newToDos = {
          ...prev,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };

        return newToDos;
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} toDos={toDos[boardId]} boardId={boardId} />
          ))}
        </Boards>
        <BoardBtn
          onClick={() => {
            setModal((prev) => !prev);
          }}
        >
          보드추가하기
        </BoardBtn>
        <Modal />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
