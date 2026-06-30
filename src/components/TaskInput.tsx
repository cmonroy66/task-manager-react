import { useState } from "react";

type TaskInputProps = {
  onAddTask: (taskText: string) => void;
};

function TaskInput(props: TaskInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim() === "") {
        return;
    }

    props.onAddTask(text);
    setText("");
  };

  return (
    <div className="task-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe una nueva tarea"
      />
      <button onClick={handleSubmit}>
        Agregar
      </button>
    </div>
  );
}

export default TaskInput;