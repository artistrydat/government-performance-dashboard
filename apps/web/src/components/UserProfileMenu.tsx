import React, { useState } from 'react';

export interface UserProfileMenuProps {
  userName?: string;
  onLogout?: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ userName = 'User', onLogout }) => {
  const [open, setOpen] = useState(false);

  const usernameInitial = (userName || 'U').charAt(0).toUpperCase();

  return (
    <div className="dropdown dropdown-end" aria-label="User profile menu">
      <button
        className="btn btn-ghost btn-circle"
        aria-expanded={open}
        aria-controls="user-profile-menu"
        onClick={() => setOpen(s => !s)}
      >
        {usernameInitial}
      </button>
      {open && (
        <ul
          id="user-profile-menu"
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
          role="menu"
        >
          <li>
            <button
              className="btn btn-ghost w-full text-left"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className="btn btn-ghost w-full text-left"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
            >
              Sign out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserProfileMenu;
