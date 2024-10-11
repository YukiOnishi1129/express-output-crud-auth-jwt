import { createBrowserRouter } from "react-router-dom";
import { NAVIGATION_LIST } from "../constants/navigation";
import { TodoPage } from "../pages/todo";
import { TodoDetailPage } from "../pages/detail";
import { TodoCreatePage } from "../pages/create";
import { TodoEditPage } from "../pages/edit";

/**
 * index
 */
export const router = createBrowserRouter([
  {
    path: NAVIGATION_LIST.TOP,
    element: <TodoPage />,
  },
  {
    path: NAVIGATION_LIST.DETAIL,
    element: <TodoDetailPage />,
  },
  {
    path: NAVIGATION_LIST.CREATE,
    element: <TodoCreatePage />,
  },
  {
    path: NAVIGATION_LIST.EDIT,
    element: <TodoEditPage />,
  },
]);
