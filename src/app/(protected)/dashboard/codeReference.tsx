'use client'

import { Tabs } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TabsContent } from '@radix-ui/react-tabs'
import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
  filesReferences: {
    id?: string;
    messageId?: string;
    fileName: string;
    sourceCode: string; 
  }[];
  setShowCodePanel: (open: boolean) => void
}

const CodeReference = ({ filesReferences = [], setShowCodePanel }: Props) => {
  const [tab, setTab] = useState(filesReferences[0]?.fileName);

  if (filesReferences.length === 0) return null;

  return (
    <div className='w-full h-full flex flex-col rounded-md overflow-hidden'>
      <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col">
        <div className='flex justify-between items-center border-b border-b-[#424242] p-2 bg-[#1e1e1e]'>
          <div className='flex overflow-x-auto '>
            {filesReferences.map(file => (
              <button
                key={file.fileName}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-r border-[#373739]',
                  'font-mono hover:bg-[#2d2d2d] text-[#cccccc]',
                  'flex items-center gap-2 flex-shrink-0',
                  {
                    'text-white bg-[#413f3f]': tab === file.fileName,
                  }
                )}
                onClick={() => setTab(file.fileName)}
              >
                <span className="truncate">{file.fileName.split('/').pop()}</span>
              </button>
            ))}
          </div>
          <button
            className="text-white hover:bg-[#2d2d2d] p-1 rounded"
            onClick={() => setShowCodePanel(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {filesReferences.map(file => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className='h-full overflow-auto bg-[#282828] scroll-custom'
          >
            <div className="sticky top-0 z-10 bg-[#282828] text-sm font-mono text-[#cccccc] px-4 py-2 border-b border-[#373739] ">
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
                padding: '1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
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