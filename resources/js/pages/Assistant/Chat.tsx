import Layout from '@/components/Layout';
import { useEffect, useRef, useState } from 'react';
import TextField from '../settings/TextField';
import ChatCard from './ChatCard';

// interface requestForm {
//     content_of_previous?: string | null;
//     content: string;
//     uuid?: string | null;
// }

interface Message {
    is_generated: boolean;
    content: string;
    isMe: boolean;
    created_at: string;
}

export default function Chat() {
    const messageRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    // const [payload, setPayload] = useState<requestForm>({
    //     content_of_previous: null,
    //     content: 'what is the sky',
    //     uuid: null,
    // });

    const [generatedMessage, setGeneratedMessage] = useState('');
    const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            is_generated: false,
            content: 'Hello my friend!   ',
            isMe: false,
            created_at: '2015-04-15 11:22:54',
        },
        // {
        //     is_generated: false,
        //     content: 'Well well well...',
        //     isMe: true,
        //     created_at: '2015-04-15 11:22:54',
        // },
    ]);

    const sendMessage = async (message) => {
        const url = route('chat.send.message');
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        console.log(token);
        try {
            setLoading(true);
            setGeneratedMessage(''); // Reset the generated message before sending a new one

            if (!message || message.trim() === '') {
                console.warn('Empty message, not sending');
                setLoading(false);
                return;
            }

            const payload = {
                content_of_previous:
                    messages[messages.length - 1]?.content || null,
                content: message,
                uuid: null,
            };

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    is_generated: false,
                    content: message,
                    isMe: true,
                    created_at: new Date().toISOString(),
                },
            ]);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/plain',
                    'X-CSRF-TOKEN': token || '',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error(response);
                setLoading(false);
                throw new Error('Http error');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk
                        .split('\n')
                        .filter((line) => line.trim());

                    for (const line of lines) {
                        try {
                            const data = JSON.parse(line);
                            setGeneratedMessage(
                                (p) => p + (data?.message?.content ?? ''),
                            );
                        } catch (e) {
                            console.warn('Invalid JSON chunk:', line);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('stream error', e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentMessage({
            is_generated: loading,
            content: generatedMessage,
            isMe: false,
            created_at: new Date().toISOString(),
        });

        if (!loading) {
            if (currentMessage && currentMessage.content.trim() !== '') {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    currentMessage,
                ]);
            }
            setCurrentMessage(null);
        }
    }, [generatedMessage, loading]);

    useEffect(() => {
        const msg = messageRef.current;
        if (!msg) return;

        const observer = new ResizeObserver(() => {
            const bubble = msg.getBoundingClientRect();
            const bottom = bubble.bottom;
            const viewvportHeight = window.innerHeight;

            if (bottom > viewvportHeight - 50) {
                msg.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }
        });
        observer.observe(msg);
        return () => {
            observer.disconnect();
        };
    }, [generatedMessage]);

    return (
        <Layout>
            <div className="flex flex-col h-full px-2 overflow-hidden">
                {/* <button className="h-64 w-64 bg-red-500" onClick={() => sendMessage()}></button> */}
                <div className="flex-1 space-y-1 overflow-y-auto">
                    {messages.map((e) => (
                        <ChatCard message={e} />
                    ))}
                    {currentMessage && (
                        <div ref={messageRef}>
                            <ChatCard message={currentMessage} />
                        </div>
                    )}
                </div>
                <div className="sticky bottom-0 border-gray-200 bg-white">
                    <div className="p-2">
                        <TextField handleSend={sendMessage} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
