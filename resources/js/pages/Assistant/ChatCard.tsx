import { StarIcon, ThumbsUp, ThumbsDown } from 'lucide-react';
import ReactMarkDown from 'react-markdown';

export default function ChatCard({ message }: { message: any }) {
    const { content, isMe, created_at } = message;
    const time = new Date(created_at).getHours() + ":" + new Date(created_at).getMinutes();
    
    return (
        <div className={`flex text-stone-950 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2/3 rounded-lg bg-white border border-gray-200`}>
                <div className='px-5 py-2'>
                    <ReactMarkDown>{content}</ReactMarkDown>
                </div>
                {!isMe && (
                    <div className="flex justify-end gap-3 px-3 py-1 border-t border-gray-100">
                        <StarIcon size={16} className="text-gray-500"/>
                        <ThumbsUp size={16} className="text-gray-500"/>
                        <ThumbsDown size={16} className="text-gray-500"/>
                    </div>
                )}
            </div>
        </div>
    );
}