import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-2xl">
        <div className="text-[10rem] font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          404
        </div>
        
        <h1 className="text-4xl font-semibold text-white">
          Page Not Found
        </h1>

        <div className="space-y-4">
          <p className="text-xl text-gray-400">
            This page is under development 🚧
          </p>
          <p className="text-gray-500">
            We&apos;re working hard to complete this feature. Please check back later!
          </p>
        </div>

        <div className="mt-8">
          <Button
            asChild
            className="bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 hover:opacity-90 transition-opacity px-8 py-4 text-lg rounded-xl"
          >
            <Link href="/">
              Return to Homepage
            </Link>
          </Button>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6">
          <p className="text-sm text-gray-600">
            Need help? Contact us at: 
            <a 
              href="mailto:thaitv225@gmail.com" 
              className="text-green-400 hover:underline ml-2"
            >
              support@repomind.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}