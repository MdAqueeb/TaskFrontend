import { useEffect, useState } from "react";
import { fetchHistory } from "../services/api";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHistory(currentPage)
      .then((data) => {
        setHistory(data.history);  // assuming backend sends { history: [...] }
        setHasMore(data.history.length === 10); // 10 items per page
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch history:", err);
        setError("Failed to load history.");
        setLoading(false);
      });
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">History</h2>

      {loading ? (
        <div>Loading history...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-gray-500">No history records found.</div>
      ) : (
        <div className="space-y-4">
          {history.map((h) => (
            <div
              key={h._id}
              className="bg-white p-4 rounded shadow flex items-center justify-between w-full"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={
                    h.userId?.profilePicture ||
                    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  }
                  alt={h.userId?.name || "User"}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-lg">
                    {h.userId?.name || "Unknown User"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {h.date
                      ? new Date(h.date).toLocaleString()
                      : "No date available"}
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 min-w-[80px] text-right">
                +{h.points}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {currentPage}</span>
        <button
          onClick={handleNext}
          disabled={!hasMore}
          className={`px-4 py-2 rounded ${
            !hasMore
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
