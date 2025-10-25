import { PaperAirplaneIcon } from '@heroicons/react/16/solid';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useState } from 'react';

export default function TextField({ handleSend }: { handleSend: any }) {
    const [value, setValue] = useState('');

    return (
        <div className="flex w-full text-stone-950 items-center gap-2 border-t border-gray-200 bg-white p-2">
            <div className="flex-1 rounded-lg border border-gray-300 p-2">
                <TextareaAutosize
                    minRows={1}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Насчет аналитики..."
                    style={{
                        width: '100%',
                        resize: 'none',
                        outline: 'none',
                        border: 'none',
                        fontSize: '14px',
                    }}
                />
            </div>
            <button
                className="rounded-lg bg-[#7700ff] px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                onClick={() => {
                    handleSend(value);
                    setValue('');
                }}
            >
                <PaperAirplaneIcon className='w-6'/>
            </button>
        </div>
    );
}
