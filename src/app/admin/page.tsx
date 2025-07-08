// app/admin/page.tsx
"use client";

import dynamic from "next/dynamic";

// Import the AdminPanel component dynamically to avoid SSR issues
const AdminPanel = dynamic(() => import("./AdminPanel"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin panel...</p>
      </div>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminPanel />;
}
