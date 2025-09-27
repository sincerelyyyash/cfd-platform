export default function SearchBar() {
  return (
    <div className="border rounded-lg flex items-center w-full px-2 py-1 h-10 ">
      <svg
        className="w-4 h-4 text-gray-500 mr-2"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        placeholder="Search assets..."
        className="w-full bg-transparent outline-none text-sm"
        aria-label="Search assets"
      />
    </div>
  )
}


