import { useState, useCallback, useEffect } from "react";
import {
  fetchTodoListApi,
  createTodoApi,
  updateTodoApi,
  deleteTodoApi,
} from "../apis/todo";
import { TodoType } from "../interfaces/Todo";

export const useTodo = () => {
  /* todolist */
  const [originTodoList, setOriginTodoList] = useState<Array<TodoType>>([]);

  /* actions */

  const fetchTodoList = useCallback(async (): Promise<void> => {
    const data = await fetchTodoListApi();

    if (data && typeof data !== "string") setOriginTodoList(data);
  }, []);

  const addTodo = useCallback(
    async (title: string, content: string) => {
      const data = await createTodoApi(title, content);
      if (data && typeof data !== "string") {
        setOriginTodoList([
          ...originTodoList,
          {
            id: data.id,
            title: data.title,
            content: data.content,
          },
        ]);
        return true;
      }
      return false;
    },
    [originTodoList]
  );

  const updateTodo = useCallback(
    async (id: number, title: string, content: string) => {
      const responseTodo = await updateTodoApi(id, title, content);
      if (responseTodo && typeof responseTodo !== "string") {
        const updatedTodoList = originTodoList.map((todo) => {
          if (responseTodo.id === todo.id) {
            return {
              id: responseTodo.id,
              title: responseTodo.title,
              content: responseTodo.content,
            };
          }

          return todo;
        });
        setOriginTodoList(updatedTodoList);
      }
      // const updatedTodoList = originTodoList.map((todo) => {
      //   if (responseTodo.id === todo.id) {
      //     return {
      //       id: responseTodo.id,
      //       title: responseTodo.title,
      //       content: responseTodo.content,
      //     };
      //   }

      //   return todo;
      // });
      // setOriginTodoList(updatedTodoList);
    },
    [originTodoList]
  );

  const deleteTodo = useCallback(
    async (targetId: number) => {
      await deleteTodoApi(targetId);

      // todoを削除したtodo listで更新
      setOriginTodoList(originTodoList.filter((todo) => todo.id !== targetId));
    },
    [originTodoList]
  );

  useEffect(() => {
    fetchTodoList();
  }, [fetchTodoList]);

  return {
    originTodoList,
    addTodo,
    updateTodo,
    deleteTodo,
  };
};
