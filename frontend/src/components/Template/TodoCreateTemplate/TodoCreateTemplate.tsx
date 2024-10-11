import { useTodoContext } from "../../../contexts/useTodoContext";
import { BaseLayout } from "../../Organism/BaseLayout";
import { InputForm } from "../../Atom/InputForm";
import { TextArea } from "../../Atom/TextArea";
import { CommonButton } from "../../Atom/CommonButton";
import { useTodoCreateTemplate } from "./useTodoCreateTemplate";
import styles from "./styles.module.css";

export const TodoCreateTemplate = () => {
  const { addTodo } = useTodoContext();
  const [
    { inputTitle, inputContent },
    { handleChangeTitle, handleChangeContent, handleCreateTodo },
  ] = useTodoCreateTemplate({ addTodo });

  return (
    <BaseLayout title={"Create Todo"}>
      <form className={styles.container} onSubmit={handleCreateTodo}>
        <div className={styles.area}>
          <InputForm
            value={inputTitle}
            placeholder={"Title"}
            onChange={handleChangeTitle}
          />
        </div>
        <div className={styles.area}>
          <TextArea
            value={inputContent}
            placeholder={"Content"}
            onChange={handleChangeContent}
          />
        </div>
        <div className={styles.area}>
          <CommonButton type="submit" title="Create Todo" />
        </div>
      </form>
    </BaseLayout>
  );
};
