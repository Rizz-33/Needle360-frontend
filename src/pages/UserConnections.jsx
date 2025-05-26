import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaUser,
  FaUserCheck,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { CustomButton } from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { useAuthStore } from "../store/Auth.store";
import { useUserInteractionStore } from "../store/UserInteraction.store";

const UserConnectionCard = ({
  user,
  currentUserId,
  onFollowToggle,
  isFollowing,
}) => {
  const navigate = useNavigate();

  const profileUrl =
    user.role === 4 ? `/tailor/${user._id}` : `/user/${user._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-4 flex items-center">
        <div
          className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden cursor-pointer"
          onClick={() => navigate(profileUrl)}
        >
          {user.logoUrl ? (
            <img
              src={user.logoUrl}
              alt={user.name || user.shopName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-400 text-white">
              {user.name?.[0] || user.shopName?.[0] || <FaUser />}
            </div>
          )}
        </div>

        <div
          className="ml-3 flex-1 cursor-pointer"
          onClick={() => navigate(profileUrl)}
        >
          <h3 className="font-medium text-gray-800 truncate">
            {user.name || user.shopName}
          </h3>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>

        {currentUserId !== user._id && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFollowToggle(user._id, isFollowing)}
            className={`ml-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              isFollowing
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                : "bg-primary text-white hover:bg-primary-dark"
            } transition-colors flex items-center gap-1`}
          >
            {isFollowing ? (
              <>
                <FaUserCheck size={12} />
                <span>Following</span>
              </>
            ) : (
              <>
                <FaUserPlus size={12} />
                <span>Follow</span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const UserConnections = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [followingStatus, setFollowingStatus] = useState({});
  const [isCheckingFollowing, setIsCheckingFollowing] = useState(false);

  const {
    followers,
    following,
    isLoading,
    error,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    checkIfFollowing,
  } = useUserInteractionStore();

  const { user: currentUser } = useAuthStore();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getFollowers(userId);
        await getFollowing(userId);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchData();
  }, [userId, getFollowers, getFollowing]);

  // Check following status after data is loaded
  useEffect(() => {
    if (!currentUser?._id || isLoading) return;

    const checkFollowingStatus = async () => {
      setIsCheckingFollowing(true);
      const status = {};

      try {
        // Check status for followers
        for (const follower of followers) {
          if (follower._id !== currentUser._id) {
            status[follower._id] = await checkIfFollowing(
              currentUser._id,
              follower._id
            );
          }
        }

        // Check status for following
        for (const followed of following) {
          if (followed._id !== currentUser._id) {
            status[followed._id] = true;
          }
        }

        setFollowingStatus(status);
      } catch (error) {
        console.error("Error checking following status:", error);
      } finally {
        setIsCheckingFollowing(false);
      }
    };

    checkFollowingStatus();
  }, [currentUser?._id, followers, following, isLoading, checkIfFollowing]);

  useEffect(() => {
    // Debug logging
    console.log("UserConnections Debug:", {
      userId,
      currentUser: currentUser?._id,
      followers: followers.length,
      following: following.length,
      isLoading,
      error,
    });
  }, [userId, currentUser, followers, following, isLoading, error]);

  const handleFollowToggle = async (targetUserId, isCurrentlyFollowing) => {
    try {
      if (!currentUser?._id) {
        navigate("/login");
        return;
      }

      if (isCurrentlyFollowing) {
        await unfollowUser(currentUser._id, targetUserId);
        setFollowingStatus((prev) => ({ ...prev, [targetUserId]: false }));
      } else {
        await followUser(currentUser._id, targetUserId);
        setFollowingStatus((prev) => ({ ...prev, [targetUserId]: true }));
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading || isCheckingFollowing) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    console.error("UserConnections Error:", error);
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md text-center">
          <h3 className="text-red-600 font-medium">
            Error Loading Connections
          </h3>
          <p className="text-sm text-red-500 mt-1">{error}</p>
          <p className="text-xs text-gray-400 mt-2">User ID: {userId}</p>
          <CustomButton
            onClick={() => {
              // Reset the store state and try again
              const { resetState, getFollowers, getFollowing } =
                useUserInteractionStore.getState();
              resetState();
              getFollowers(userId);
              getFollowing(userId);
            }}
            text="Try Again"
            color="primary"
            hover_color="hoverAccent"
            variant="outlined"
            className="mt-3"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center">
          <motion.button
            onClick={goBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 hover:text-primary p-1 rounded-full"
          >
            <FaChevronLeft className="text-lg" />
          </motion.button>

          <h1 className="ml-2 text-xl font-bold text-gray-800">
            {userId === currentUser?._id
              ? "Your Connections"
              : "User Connections"}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setTabValue(0)}
            className={`flex-1 py-3 flex flex-col items-center ${
              tabValue === 0
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-1">
              <FaUsers size={14} />
              <span className="text-sm font-medium">Followers</span>
            </div>
            <span className="text-xs mt-1 bg-gray-100 rounded-full px-2 py-0.5">
              {followers.length}
            </span>
          </button>

          <button
            onClick={() => setTabValue(1)}
            className={`flex-1 py-3 flex flex-col items-center ${
              tabValue === 1
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-1">
              <FaUserCheck size={14} />
              <span className="text-sm font-medium">Following</span>
            </div>
            <span className="text-xs mt-1 bg-gray-100 rounded-full px-2 py-0.5">
              {following.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {tabValue === 0 ? (
            <motion.div
              key="followers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {followers.length === 0 ? (
                <div className="text-center py-10">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                    <FaUsers size={24} />
                  </div>
                  <h3 className="text-gray-600 font-medium">
                    No followers yet
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    When someone follows you, they'll appear here.
                  </p>
                </div>
              ) : (
                followers.map((user) => (
                  <UserConnectionCard
                    key={user._id}
                    user={user}
                    currentUserId={currentUser?._id}
                    onFollowToggle={handleFollowToggle}
                    isFollowing={followingStatus[user._id]}
                  />
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="following"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {following.length === 0 ? (
                <div className="text-center py-10">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                    <FaUserCheck size={24} />
                  </div>
                  <h3 className="text-gray-600 font-medium">
                    Not following anyone yet
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Follow other users to see their updates here.
                  </p>
                  <CustomButton
                    onClick={() => navigate("/explore")}
                    text="Explore Users"
                    color="primary"
                    hover_color="hoverAccent"
                    variant="filled"
                    className="mt-4"
                  />
                </div>
              ) : (
                following.map((user) => (
                  <UserConnectionCard
                    key={user._id}
                    user={user}
                    currentUserId={currentUser?._id}
                    onFollowToggle={handleFollowToggle}
                    isFollowing={followingStatus[user._id]}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserConnections;
