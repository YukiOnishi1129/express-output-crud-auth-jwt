import { useParams } from "react-router-dom";
import { BaseLayout } from "../../Organism/BaseLayout";
import { InputForm } from "../../Atom/InputForm";
import { TextArea } from "../../Atom/TextArea";
import styles from "./styles.module.css";
import { useCallback, useEffect, useState } from "react";
import { fetchTodoDetailApi } from "../../../apis/todo";
import { TodoType } from "../../../interfaces/Todo";

export const TodoDetailTemplate = () => {
  const { id } = useParams();
  //   const todo = originTodoList.find((todo) => String(todo.id) === id);

  const [todo, setTodo] = useState<TodoType | null>(null);

  const fetchTodoDetail = useCallback(async () => {
    const data = await fetchTodoDetailApi(Number(id));
    if (data && typeof data !== "string") {
      setTodo({
        id: data.id,
        title: data.title,
        content: data.content,
      });
    }
  }, [id]);

  useEffect(() => {
    fetchTodoDetail();
  }, [fetchTodoDetail]);

  return (
    <BaseLayout title={"TodoDetail"}>
      {!!todo && (
        <div className={styles.container}>
          <div className={styles.area}>
            <InputForm disabled value={todo.title} placeholder={"Title"} />
          </div>
          <div className={styles.area}>
            <TextArea disabled value={todo.content} placeholder={"Content"} />
          </div>
        </div>
      )}
    </BaseLayout>
  );
};
