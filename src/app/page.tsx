import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Capitalia Web
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Your comprehensive web application with secure admin authentication powered by Supabase.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/admin/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 "
            >
              Admin Login
            </Link>
            
            <Link
              href="/admin/dashboard"
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 "
            >
              Dashboard
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg ">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/next.svg"
                  alt="Next.js"
                  width={24}
                  height={24}
                  className="dark:invert"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Next.js 15</h3>
              <p className="text-gray-600">Latest version with App Router and Turbopack for optimal performance.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg ">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Supabase Auth</h3>
              <p className="text-gray-600">Secure authentication with admin role-based access control.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg ">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">TypeScript</h3>
              <p className="text-gray-600">Type-safe development with modern TypeScript features.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}