import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { modalState, saveToDos, toDoState } from "../atoms";

const Container = styled.div<{ modal: boolean }>`
  display: ${(props) => (!props.modal ? "none" : "block")};
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
  background-color: #dfe6e9;
  opacity: 0.8;
`;

const Form = styled.form`
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #a29bfe;
  padding: 15px 15px;
`;
export const Modal = () => {
  const [toDo, setTodo] = useRecoilState(toDoState);
  const [name, setName] = useState("");
  const [modal, setModal] = useRecoilState(modalState);
  const boardInfo = useRef(null);

  useEffect(() => {
    saveToDos(toDo);
  }, [toDo]);

    

  return (
    <Container modal={modal}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          name.length !== 0 &&
            setTodo((prev) => {
              const newBoard = {
                ...prev,
                [name]: [],
              };
              return newBoard;
            });
          setModal((prev) => !prev);
          setName("");
        }}
      >
        <span>보드 이름을 입력해주세요</span>
        <input
          ref={boardInfo}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
          }}
        />
      </Form>
    </Container>
  );
};

export default Modal;
