'use client'

import { Tabs } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TabsContent } from '@radix-ui/react-tabs'
import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
    filesReferences: { fileName: string, sourceCode: string, summary: string }[]
}

const CodeReference = ({ filesReferences = [] }: Props) => {
    const [tab, setTab] = useState(filesReferences[0]?.fileName);
    if (filesReferences.length === 0) return null;

    return (
        <div className='w-full h-full flex flex-col rounded-md overflow-hidden scroll-custom'>
            <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col scroll-custom">
                <div className='flex overflow-x-auto scroll-custom hide-scrollbar'>
                    {filesReferences.map(file => (
                        <button
                            key={file.fileName}
                            className={cn(
                                'px-4 py-2 text-sm font-medium border-r border-[#373739]',
                                'font-mono hover:bg-[#2d2d2d] text-[#cccccc]',
                                'flex items-center gap-2 flex-shrink-0',
                                {
                                    'text-white bg-[#1e1e1e]': tab === file.fileName,
                                }
                            )}
                            onClick={() => setTab(file.fileName)}
                        >
                            <span className="truncate">{file.fileName.split('/').pop()}</span>
                        </button>
                    ))}
                </div>

                {filesReferences.map(file => (
                    <TabsContent
                        key={file.fileName}
                        value={file.fileName}
                        className='h-full overflow-auto relative scroll-custom flex-1'
                    >
                        <div className="sticky top-0 z-10 bg-[#282828] text-sm font-mono text-[#cccccc] px-4 py-2 border-b border-[#373739]">
                            {file.fileName}
                        </div>
                        <SyntaxHighlighter
                            language='typescript'
                            style={vscDarkPlus}
                            showLineNumbers
                            wrapLines
                            customStyle={{
                                background: '#282828',
                                margin: 0,
                                paddingTop: '1rem',
                                fontSize: '0.975rem',
                                lineHeight: '1.5',
                                fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace'
                            }}
                            lineNumberStyle={{
                                color: '#424242',
                                minWidth: '2.5em',
                                paddingRight: '1rem',
                                userSelect: 'none'
                            }}
                        >
                            {file.sourceCode}
                        </SyntaxHighlighter>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default CodeReference