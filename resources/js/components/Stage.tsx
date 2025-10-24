
import { useDroppable } from '@dnd-kit/core';
import ProjectCard from './ProjectCard';

export default function Stage({ stage, isOver }) {
    const { setNodeRef } = useDroppable({
        id: stage.id,
    });
    const style = {
        backgroundColor: isOver ? '#ff9875' : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            key={stage.id}
            className={`w-96 flex-shrink-0 bg-white min-h-[400px] rounded-md border-gray-200 p-4 text-stone-950`}
        >
            <h3 className="text-md kanban-column mb-4 bg-[#ff4f12] p-3 font-semibold text-white">
                {stage.name.toUpperCase()}
            </h3>
            <div className="space-y-3">
                {stage?.projects?.map((project) => (
                    <ProjectCard project={project} />
                ))}
            </div>
        </div>
    );
}
