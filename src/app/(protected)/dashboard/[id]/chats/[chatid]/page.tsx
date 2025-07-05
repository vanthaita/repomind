'use client'
import React from 'react'
import useProject from '@/hooks/use-project'
import { usePathname } from 'next/navigation'
import AskQuestion from '../../../askQuestion'
import { SectionLoading } from '@/components/ui/loading'

const ChatPage = () => {
    const { project } = useProject()
    const pathname = usePathname(); 
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];
    
    if (!id) {
        return (
            <section className='h-screen flex flex-col bg-[#282828] text-white overflow-hidden'>
                <header className="w-full h-20 border-b border-[#383838] flex items-center px-4 bg-[#282828]/90 backdrop-blur-sm">
                    <div className="flex-1">
                        <div className='flex items-end gap-2'>
                            <h1 className="text-2xl font-bold bg-green-500 bg-clip-text text-transparent">
                                {project?.name || 'New Project'}{' '}
                            </h1>
                        </div>
                        <p className="text-sm text-[#888] mt-1">
                            {project?.githubUrl || 'No repository selected'}
                        </p>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-300">Invalid conversation ID.</p>
                </div>
            </section>
        );
    }

    return (
        <section className='h-screen flex flex-col  text-white overflow-hidden'>
            <div className="flex-1 overflow-auto">
                <AskQuestion conversationId={id} />
            </div>
        </section>
    )
}

export default ChatPage