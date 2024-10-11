/**
 * TodoEditTemplate
 *
 * @package components
 */
import { useTodoContext } from "../../../contexts/useTodoContext";
import { BaseLayout } from "../../Organism/BaseLayout";
import { InputForm } from "../../Atom/InputForm/";
import { TextArea } from "../../Atom//TextArea/";
import { CommonButton } from "../../Atom/CommonButton/";
import { useTodoEditTemplate } from "./useTodoEditTemplate";
import styles from "./styles.module.css";

/**
 * TodoEditTemplate
 * @returns {JSX.Element}
 * @constructor
 */
export const TodoEditTemplate = () => {
  const { originTodoList, updateTodo } = useTodoContext();

  const [
    { todo, inputTitle, inputContent },
    { handleChangeTitle, handleChangeContent, handleUpdateTodo },
  ] = useTodoEditTemplate({ originTodoList, updateTodo });

  return (
    <BaseLayout title={"TodoEdit"}>
      {!!todo && (
        <form className={styles.container} onSubmit={handleUpdateTodo}>
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
            <CommonButton type="submit" title="Edit Todo" />
          </div>
        </form>
      )}
    </BaseLayout>
  );
};
