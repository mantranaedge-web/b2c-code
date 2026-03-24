'use client';

export default function CourseSidebar({ 
  categories, 
  levels, 
  selectedCategory, 
  selectedLevel, 
  onCategoryChange, 
  onLevelChange,
  courseCount 
}) {
  return (
    <aside className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filter Courses</h2>
      
      {/* Results Count */}
      <div className="mb-6 p-3 bg-primary-50 rounded-lg">
        <p className="text-sm text-primary-900">
          <span className="font-bold">{courseCount}</span> courses found
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Level</h3>
        <div className="space-y-2">
          <button
            onClick={() => onLevelChange('all')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedLevel === 'all'
                ? 'bg-primary-600 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            All Levels
          </button>
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => onLevelChange(level)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedLevel === level
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategory !== 'all' || selectedLevel !== 'all') && (
        <button
          onClick={() => {
            onCategoryChange('all');
            onLevelChange('all');
          }}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}