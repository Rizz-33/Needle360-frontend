import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/Auth.store";
import { useUserInteractionStore } from "../store/UserInteraction.store";

const UserListItem = ({ user, currentUserId, onFollowToggle, isFollowing }) => {
  const navigate = useNavigate();

  const profileUrl =
    user.role === 4 ? `/tailor/${user._id}` : `/user/${user._id}`;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={user.logoUrl} alt={user.name || user.shopName}>
          {user.name?.[0] || user.shopName?.[0] || "?"}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={user.name || user.shopName}
        secondary={user.email}
        onClick={() => navigate(profileUrl)}
        style={{ cursor: "pointer" }}
      />
      <ListItemSecondaryAction>
        {currentUserId !== user._id && (
          <Button
            variant={isFollowing ? "outlined" : "contained"}
            color="primary"
            onClick={() => onFollowToggle(user._id, isFollowing)}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </ListItemSecondaryAction>
    </ListItem>
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

  if (isLoading || isCheckingFollowing) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {userId === currentUser?._id ? "Your Connections" : "User Connections"}
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label={`Followers (${followers.length})`} />
        <Tab label={`Following (${following.length})`} />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabValue === 0 && (
          <List>
            {followers.length === 0 ? (
              <Typography>No followers yet</Typography>
            ) : (
              followers.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  currentUserId={currentUser?._id}
                  onFollowToggle={handleFollowToggle}
                  isFollowing={followingStatus[user._id]}
                />
              ))
            )}
          </List>
        )}

        {tabValue === 1 && (
          <List>
            {following.length === 0 ? (
              <Typography>Not following anyone yet</Typography>
            ) : (
              following.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  currentUserId={currentUser?._id}
                  onFollowToggle={handleFollowToggle}
                  isFollowing={followingStatus[user._id]}
                />
              ))
            )}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default UserConnections;
