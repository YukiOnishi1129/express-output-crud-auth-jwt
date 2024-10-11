import { useContext } from "react";
import { TodoContext } from "./TodoContext";

export const useTodoContext = () => useContext(TodoContext);
