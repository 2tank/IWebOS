import { Link, useLocation } from 'react-router-dom'; 
import SearchBar from './SearchBar'; 
import Avatar from '@mui/material/Avatar';
import Notification from '../Common/Notification';
import { useNotification } from './NotificationContext';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../Login/LoginButton';
import LogoutButton from '../Login/LogoutButton';
import GoogleLog from './GoogleLog';
import GoogleTranslate from './GoogleTranslate';

const Navbar = () => {

  {/*
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  */}

  const location = useLocation();
  const shouldShowSearchBar = location.pathname !== "/";

  const { unreadCount } = useNotification();

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-amber-950 text-white">
      <div className="flex items-center">
        <Link to="/" className="hover:opacity-80">
            <Avatar sx={{ width: 80, height: 80 }} src='/assets/logo_wiki_blanco.png'/>
        </Link>
      </div>

      <div className="flex-grow flex justify-center mb-2 sm:mb-0">
        {shouldShowSearchBar && <SearchBar />}
      </div>

      <div className="mt-2 sm:mt-0 flex flex-row items-center space-x-4">
        <Link className="row" to="/notifications">
          <Notification unreadCount={unreadCount} />
        </Link>

        <div className="flex items-center space-x-2">
          <GoogleLog />
        </div>

        <div className="flex items-center space-x-2">
          <GoogleTranslate />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
