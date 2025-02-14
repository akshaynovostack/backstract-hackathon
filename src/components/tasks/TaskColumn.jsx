import { Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

export default function TaskColumn({ title, tasks, provided }) {
  return (
    <div
      className="bg-gray-100 rounded-lg p-4 h-full"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      <h3 className="font-semibold mb-4 text-gray-700">{title}</h3>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={snapshot.isDragging ? "opacity-50" : ""}
              >
                <TaskCard task={task} />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    </div>
  );
}
