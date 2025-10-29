import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 max-w-screen-xl py-8">
          <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Main Page</h2>
            <p className="text-gray-600 leading-relaxed">
              This is the main landing page of your application. The header component above is now 
              automatically included on all non-admin pages through the root layout.
            </p>
          </section>
          
          <section className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h3>
            <div className="prose text-gray-600">
              <p>Your page builder system is ready! The header component demonstrates:</p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Responsive design with Tailwind CSS</li>
                <li>Clean, modern styling</li>
                <li>Ready for inline editing capabilities</li>
                <li>Conditional rendering (hidden on admin pages)</li>
              </ul>
            </div>
          </section>
      </div>
    </main>
  );
}