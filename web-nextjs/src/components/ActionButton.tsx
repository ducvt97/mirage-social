import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type ActionButtonProps = {
  items: { label: string; icon?: React.ReactNode; onClick: () => void }[];
};

const ActionButton = ({ items }: ActionButtonProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleClickMenuItem = (action: () => void) => {
    action();
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton aria-label="actions" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="action-button-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ list: { "aria-labelledby": "action-button-trigger" } }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => handleClickMenuItem(item.onClick)}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionButton;
