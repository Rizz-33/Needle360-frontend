// src/pages/UserConnections.jsx
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

  // Navigate to /tailor/:id for tailors (role === 4), /user/:id for others
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

  const [followingStatus, setFollowingStatus] = useState({});

  useEffect(() => {
    getFollowers(userId);
    getFollowing(userId);

    const checkAllFollowingStatus = async () => {
      const status = {};

      for (const follower of followers) {
        if (currentUser?._id && follower._id !== currentUser._id) {
          const isFollowing = await checkIfFollowing(
            currentUser._id,
            follower._id
          );
          status[follower._id] = isFollowing;
        }
      }

      for (const followed of following) {
        if (currentUser?._id && followed._id !== currentUser._id) {
          status[followed._id] = true;
        }
      }

      setFollowingStatus(status);
    };

    if (currentUser?._id) {
      checkAllFollowingStatus();
    }
  }, [
    userId,
    currentUser?._id,
    getFollowers,
    getFollowing,
    checkIfFollowing,
    followers,
    following,
  ]);

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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {userId === currentUser?._id ? "Your Connections" : "User Connections"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label={`Followers (${followers.length})`} />
        <Tab label={`Following (${following.length})`} />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
          </>
        )}
      </Box>
    </Container>
  );
};

export default UserConnections;
