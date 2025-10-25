import { useDraggable } from '@dnd-kit/core';
import { TrashIcon } from '@heroicons/react/16/solid';

export default function ProjectCard({ project }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: project.id,
            data: { ...project },
        });
    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    const handleShowProject = () => {
        console.log(222);
    };

    const handleDeleteProject = () => {
        console.log(111);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group z-10 flex flex-col rounded-xs border bg-white/50 p-2 text-stone-950 shadow-sm backdrop-blur-md ${isDragging ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="mb-1 flex items-start justify-between">
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        handleShowProject();
                    }}
                    className="cursor-pointer text-sm font-semibold"
                >
                    {project.name.toUpperCase()}
                </button>
                <div className="rounded bg-blue-100 px-1 text-xs">
                    #
                    {(project?.project_number ?? '').trim() !== ''
                        ? project?.project_number
                        : ''}
                </div>
            </div>

            <div className="mb-2 text-xs text-gray-600">
                {project.description}
            </div>

            <div className="flex items-center justify-between text-xs">
                <span>{new Date(project.date).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    {project.client && (
                        <div className="mt-1 text-xs text-gray-500">
                            Клиент: {project.client}
                        </div>
                    )}
                </div>
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        handleDeleteProject();
                    }}
                    title="Удалить"
                    className="flex cursor-pointer gap-2 text-sm text-red-300 opacity-0 transition-opacity group-hover:opacity-100"
                >
                    <TrashIcon className="w-4" />
                </button>
            </div>
        </div>
    );
}
