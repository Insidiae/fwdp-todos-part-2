import React from "react";
import { Form } from "react-router-dom";

export type Todo = {
  content: string;
  id: string;
  isCompleted?: boolean;
};

export default function TodoItem({ content, id, isCompleted }: Todo) {
  const [isEditing, setIsEditing] = React.useState(false);
  return (
    <li key={id}>
      <Form
        method="POST"
        className={`todo ${isCompleted && !isEditing ? "todo--completed" : ""}`}
        onSubmit={() => setIsEditing(false)}
      >
        {isEditing ? (
          <>
            <input type="hidden" name="id" value={id} />
            <input
              type="text"
              name="content"
              className="todo__content"
              defaultValue={content}
              required
              autoFocus
            />
            <button
              type="button"
              className="todo__cancel"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              name="intent"
              value="updateTodo"
              className="todo__submit"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              name="intent"
              value="toggleTodo"
              className="todo__content"
            >
              {content}
            </button>
            <button
              type="button"
              className="todo__edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              type="submit"
              name="intent"
              value="deleteTodo"
              className="todo__close"
            >
              Close
            </button>
          </>
        )}
      </Form>
    </li>
  );
}
