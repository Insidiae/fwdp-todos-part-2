import React from "react";
import {
  Form,
  json,
  useLoaderData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router-dom";

import TodoItem from "../components/TodoItem";
import type { Todo } from "../components/TodoItem";

async function loader() {
  //? For now, we just use localStorage to store the todos.
  //? Once we are handling server-side logic,
  //? we can also use different types of databases here!
  const todos = JSON.parse(
    window.localStorage.getItem("todos") ?? "[]"
  ) as Todo[];

  return json({
    todos,
  });
}

async function action({ request }: ActionFunctionArgs) {
  const todos = JSON.parse(
    window.localStorage.getItem("todos") ?? "[]"
  ) as Todo[];

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "addTodo") {
    const content = formData.get("content") as string;

    todos.push({
      content,
      id: crypto.randomUUID(),
    });

    window.localStorage.setItem("todos", JSON.stringify(todos));

    return json({
      ok: true,
    });
  }

  //? You can also merge the `toggleTodo` and `updateTodo` logic
  //? into a single `if` branch if you wanted to!
  if (intent === "toggleTodo") {
    const id = formData.get("id");

    window.localStorage.setItem(
      "todos",
      JSON.stringify(
        todos.map((todo) => {
          if (todo.id !== id) {
            return todo;
          }

          return {
            ...todo,
            isCompleted: !todo.isCompleted,
          };
        })
      )
    );

    return json({
      ok: true,
    });
  }

  if (intent === "updateTodo") {
    const id = formData.get("id");
    const content = formData.get("content") as string;

    window.localStorage.setItem(
      "todos",
      JSON.stringify(
        todos.map((todo) => {
          if (todo.id !== id) {
            return todo;
          }

          return {
            ...todo,
            content,
          };
        })
      )
    );

    return json({
      ok: true,
    });
  }

  if (intent === "deleteTodo") {
    const id = formData.get("id");

    window.localStorage.setItem(
      "todos",
      JSON.stringify(todos.filter((todo) => todo.id !== id))
    );

    return json({
      ok: true,
    });
  }

  throw json({ message: "Invalid intent" }, { status: 400 });
}

export default function RootRoute() {
  const { todos } = useLoaderData() as { todos: Todo[] };
  const addTodoRef = React.useRef<HTMLFormElement>(null!);

  const [preview, setPreview] = React.useState("");

  const navigation = useNavigation();

  React.useEffect(() => {
    if (navigation.state === "submitting") {
      const intent = navigation.formData?.get("intent");

      if (intent === "addTodo") {
        addTodoRef.current.reset();
        setPreview("");
      }
    }
  }, [navigation.state, navigation.formData]);

  return (
    <>
      <h1>Todo List</h1>
      <ul id="todos">
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
        <li className={`todo todo--preview ${preview ? "" : "hidden"}`}>
          <span className="todo__content">{preview}</span>
        </li>
      </ul>
      <Form method="POST" ref={addTodoRef} id="add-todo">
        <label htmlFor="new-todo" className="label">
          New Item
        </label>
        <div className="row">
          <input
            type="text"
            name="content"
            id="new-todo"
            className="input"
            onChange={(event) => setPreview(event.target.value)}
            required
          />
          <button
            type="submit"
            className="submit-btn"
            name="intent"
            value="addTodo"
          >
            + Add Todo
          </button>
        </div>
      </Form>
    </>
  );
}

RootRoute.loader = loader;
RootRoute.action = action;
