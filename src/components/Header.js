'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function HeaderContent({ onSearch }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) => pathname === path;

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ED</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EdTech Pro</h1>
              <p className="text-xs text-gray-500">Corporate Training</p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          {pathname === '/' && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search courses..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Right Nav */}
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className={`hidden sm:block px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Courses
            </Link>
            <Link
              href="/admin"
              className={`hidden sm:block px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/admin')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Admin
            </Link>
            <Link
              href="/vendor"
              className={`hidden sm:block px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/vendor')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Vendor
            </Link>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Contact Sales
            </button>
          </nav>
        </div>

        {/* Mobile Search */}
        {pathname === '/' && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search courses..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div className="sm:hidden flex gap-2 pb-4">
          <Link
            href="/"
            className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive('/')
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Courses
          </Link>
          <Link
            href="/admin"
            className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive('/admin')
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Admin
          </Link>
          <Link
            href="/vendor"
            className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive('/vendor')
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Vendor
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Header({ onSearch }) {
  return (
    <Suspense fallback={
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ED</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EdTech Pro</h1>
                <p className="text-xs text-gray-500">Corporate Training</p>
              </div>
            </Link>
          </div>
        </div>
      </header>
    }>
      <HeaderContent onSearch={onSearch} />
    </Suspense>
  );
}