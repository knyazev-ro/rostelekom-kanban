import { useDraggable } from '@dnd-kit/core';

export default function ProjectCard({ project }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: project.id,
        data: { ...project },
    });
    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`flex flex-col text-stone-950 rounded-xs border bg-white/50 p-2 shadow-sm backdrop-blur-md z-10 ${isDragging ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="flex">
                <div className="text-sm font-semibold">
                    {project.name.toUpperCase()}
                </div>
            </div>
            <div className="flex">{project.description}</div>
        </div>
    );
}
