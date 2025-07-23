import { useState, useEffect } from "react";
import { fetchUsers, addUser, claimPoints } from "../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [claimResult, setClaimResult] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);

  const [newName, setNewName] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null); // will store base64 or URL preview



  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = (page) => {
    fetchUsers(page)
      .then((data) => {
        const usersData = Array.isArray(data) ? data : data?.users ?? [];
        setUsers(usersData);
        setHasMore(usersData.length === 10);
      })
      .catch((err) => {
        console.error("Error loading users:", err);
        setUsers([]);
      });
  };

  const handleAdd = () => {
    if (!newName.trim()) {
      alert("Name is required.");
      return;
    }

    const userData = { name: newName.trim() };
    if (newProfilePic) {
      userData.profilePicture = newProfilePic;
    }

    addUser(userData)
      .then(() => {
        setShowAddCard(false);
        setNewName("");
        setNewProfilePic(null);
        loadUsers(currentPage);
      })
      .catch(console.error);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleClaim = (userId) => {
    setClaimResult(null);
    claimPoints(userId)
      .then((res) => {
        setClaimResult({ success: true, points: res.points, message: res.message });
        loadUsers(currentPage);
      })
      .catch(() => {
        setClaimResult({ success: false, message: "Failed to claim points" });
      });
  };

  useEffect(() => {
    if (claimResult) {
      const timer = setTimeout(() => {
        setClaimResult(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [claimResult]);

  if (selectedUser) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <button
          onClick={() => {
            setSelectedUser(null);
            setClaimResult(null);
          }}
          className="mb-4 text-blue-600 hover:underline"
        >
          &larr; Back to Friends
        </button>

        <div className="bg-white p-6 rounded shadow text-center space-y-4">
          <img
            src={selectedUser.profilePicture}
            alt={selectedUser.name}
            className="w-32 h-32 rounded-full mx-auto object-cover"
          />
          <h2 className="text-2xl font-semibold">{selectedUser.name}</h2>
          <p className="text-gray-700">Points: {selectedUser.points}</p>
          <p className="text-gray-700">Rank: {selectedUser.rank}</p>

          <button
            onClick={() => handleClaim(selectedUser._id)}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Claim
          </button>

          {claimResult && (
            <div
              className={`mt-4 p-4 rounded ${
                claimResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              } flex flex-col items-center space-y-2`}
            >
              {claimResult.success ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2v4m0 12v4m7-7h-4m-6 0H5m14.364-6.364l-2.828 2.828m-8.486 8.486l-2.828 2.828m0-14.142l2.828 2.828m8.486 8.486l2.828 2.828"
                    />
                  </svg>
                  <div className="font-semibold text-lg">Points</div>
                  <div className="text-2xl font-bold">{claimResult.points}</div>
                </>
              ) : (
                <div className="font-semibold">{claimResult.message}</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto relative">
      <h2 className="text-xl font-bold mb-4">Friends</h2>

      {users.length === 0 ? (
        <div className="text-gray-500">No users found.</div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white hover:bg-blue-100 border hover:border-blue-400 p-4 rounded shadow flex items-center space-x-4 transition-all w-full cursor-pointer"
              onClick={() => {
                setSelectedUser(u);
                setClaimResult(null);
              }}
            >
              <img
                src={u.profilePicture}
                alt={u.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <span className="font-semibold text-lg">{u.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

  
      <div className="flex justify-between items-center mt-6 max-w-3xl mx-auto">
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

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowAddCard(true)}
          className="bg-blue-400 text-white rounded-full w-16 h-16 p-4 flex items-center justify-center shadow-xl text-lg cursor-pointer hover:bg-blue-600"
          title="Add New User"
        >
          New
        </button>
      </div>

      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4 relative">
            <h3 className="text-xl font-semibold">Add New User</h3>

            <label className="block">
              <span className="text-gray-700 font-medium">Name *</span>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">Profile Picture (optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
            </label>

            {newProfilePic && (
              <img
                src={newProfilePic}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
            )}

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddCard(false);
                  setNewName("");
                  setNewProfilePic(null);
                }}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
