import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_PATH } from "../../../constants/navigation";
import { EventType } from "../../../interfaces/Event";

type Param = {
  addTodo: (title: string, content: string) => Promise<boolean>;
};

type StatesType = {
  inputTitle: string;
  inputContent: string;
};

type ActionsType = {
  handleChangeTitle: EventType["onChangeInput"];
  handleChangeContent: EventType["onChangeTextArea"];
  handleCreateTodo: EventType["onSubmit"];
};

/**
 * useTodoCreateTemplate
 * @param addTodo
 */
export const useTodoCreateTemplate = ({ addTodo }: Param) => {
  const navigate = useNavigate();

  /* local state */
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");
  /**
   * 「title」変更処理
   * @type {function(*): void}
   */
  const handleChangeTitle: EventType["onChangeInput"] = useCallback(
    (e) => setInputTitle(e.target.value),
    []
  );

  /**
   * 「content」変更処理
   * @type {function(*): void}
   */
  const handleChangeContent: EventType["onChangeTextArea"] = useCallback(
    (e) => setInputContent(e.target.value),
    []
  );

  /**
   * Todo追加処理
   * @type {(function(*): void)|*}
   */
  const handleCreateTodo: EventType["onSubmit"] = useCallback(
    async (e) => {
      e.preventDefault();
      if (inputTitle !== "" && inputContent !== "") {
        const res = await addTodo(inputTitle, inputContent);
        if (res) {
          navigate(NAVIGATION_PATH.TOP);
        }
      }
    },
    [addTodo, inputTitle, inputContent, navigate]
  );

  const states: StatesType = {
    inputTitle,
    inputContent,
  };

  const actions: ActionsType = {
    handleChangeTitle,
    handleChangeContent,
    handleCreateTodo,
  };

  return [states, actions] as const;
};
