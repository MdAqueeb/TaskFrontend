import { useEffect, useState } from "react";
import { fetchRankedUsers, updateRanks } from "../services/api";

const ITEMS_PER_PAGE = 10;

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    updateRanks()
      .then(() => fetchRankedUsers(currentPage, ITEMS_PER_PAGE))
      .then((data) => {
        setUsers(data.users); // assuming backend returns { users: [...] }
        setHasMore(data.users.length === ITEMS_PER_PAGE);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading leaderboard:", err);
        setError("Failed to load leaderboard.");
        setUsers([]);
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
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>

      {loading ? (
        <div>Loading leaderboard...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">No ranked users found.</div>
      ) : (
        <>
          <div className="space-y-4">
            {users.map((u, i) => {
              const rank = (currentPage - 1) * ITEMS_PER_PAGE + i + 1;

              let bgColor = "bg-white";
              if (rank === 1) bgColor = "bg-yellow-200";
              else if (rank === 2) bgColor = "bg-gray-200";
              else if (rank === 3) bgColor = "bg-orange-200";

              return (
                <div
                  key={u._id || u.id}
                  className={`p-4 rounded shadow flex items-center space-x-4 ${bgColor}`}
                >
                  <div className="text-2xl font-bold text-gray-700 w-8">{rank}.</div>
                  <img
                    src={
                      u.photo ||
                      u.profilePicture ||
                      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    }
                    alt={u.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{u.name}</div>
                    <div className="text-sm text-gray-600">Points: {u.points}</div>
                  </div>
                </div>
              );
            })}
          </div>

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
        </>
      )}
    </div>
  );
}
