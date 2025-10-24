import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ArrowDownOnSquareStackIcon, Cog6ToothIcon, PencilIcon, Square3Stack3DIcon, TrashIcon } from '@heroicons/react/16/solid';
import { router } from '@inertiajs/react';

export default function CellAction({ value }) {
    return (
        <div className="relative">
            <Menu>
                <MenuButton className="group inline-flex items-center gap-2 rounded-xs px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-200 data-open:bg-gray-300">
                    <Cog6ToothIcon className="size-5 fill-black" />
                </MenuButton>

                <MenuItems
                    transition
                    anchor="bottom end"
                    className="absolute w-52 origin-top-right translate-x-2 rounded-sm border border-gray-300 bg-white/50 p-2 text-sm/6 font-semibold text-stone-950 shadow-lg backdrop-blur-lg transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                >
                    <MenuItem>
                        <button
                            onClick={() => router.get(route('booking.edit', value?.row?.original?.id))}
                            className="group flex w-full cursor-pointer items-center gap-2 rounded-xs px-3 py-1.5 hover:bg-blue-100"
                        >
                            <PencilIcon className="size-4 fill-stone-950" />
                            Edit
                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘E</kbd>
                        </button>
                    </MenuItem>
                    <div className="my-1 h-px bg-white/5" />
                    <MenuItem>
                        <button
                            onClick={() =>
                                router.delete(route('booking.destroy', value?.row?.original?.id), {
                                    preserveState: false,
                                })
                            }
                            className="group flex w-full cursor-pointer items-center gap-2 rounded-xs px-3 py-1.5 hover:bg-blue-100"
                        >
                            <TrashIcon className="size-4 fill-stone-950" />
                            Delete
                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
                        </button>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    );
}
