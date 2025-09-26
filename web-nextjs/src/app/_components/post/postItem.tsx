"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  Button,
  Typography,
} from "@mui/material";
import {
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import ActionButton from "@/components/ActionButton";
import { useAppSelector } from "@/stores/hooks";
import { PostDetail } from "@/interfaces";

type PostItemProps = {
  post: PostDetail;
  likePostSuccess?: (postId: string, likes: number, userLike: string[]) => void;
};

const PostItem = React.memo(({ post, likePostSuccess }: PostItemProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const [showCommentPart, setShowCommentPart] = useState(false);

  const menuItems = [
    {
      label: "Edit",
      icon: <EditIcon />,
      onClick: () => console.log("Edit"), // TODO
    },
    {
      label: "Delete",
      icon: <DeleteIcon />,
      onClick: () => console.log("Delete"),
    }, // TODO
  ];

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar
            src={
              post.userDetails.avatar ||
              "https://avatars.githubusercontent.com/u/739984?v=4"
            }
          />
        }
        action={
          <ActionButton
            items={menuItems}
          />
        }
        title={`${post.userDetails.firstName} ${post.userDetails.lastName}`}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {post.content}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button startIcon={<LikeIcon />}>Like</Button>
        <Button
          startIcon={<CommentIcon />}
          onClick={() => setShowCommentPart(true)}
        >
          Comment
        </Button>
        <Button startIcon={<ShareIcon />}>Share</Button>
      </CardActions>
      <Collapse in={showCommentPart} timeout="auto" unmountOnExit>
        <CardContent></CardContent>
      </Collapse>
    </Card>
  );
});

export default PostItem;
