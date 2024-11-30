import { Link, useLocation } from 'react-router-dom'; 
import SearchBar from './SearchBar'; 
import Avatar from '@mui/material/Avatar';
import Notification from './Notification'

const Navbar = () => {
  const location = useLocation();
  const shouldShowSearchBar = location.pathname !== "/";

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-yellow-950 text-white">
      <div className="flex items-center">
        <Link to="/" className="hover:opacity-80">
            <Avatar sx={{ width: 80, height: 80 }} src='/assets/logo_wiki_blanco.png'/>
        </Link>
      </div>

      <div className="flex-grow flex justify-center mb-2 sm:mb-0">
        {shouldShowSearchBar && <SearchBar className="w-full sm:w-auto"/>}
      </div>
      

      <div className='flex items-center mt-2 sm:mt-0'>
      <Link to="/notifications">
        <Notification/>
      </Link>
      <Link to="/" className="hover:opacity-80 flex items-center flex-col sm:flex-row">
            <Avatar src='/src/assets/image.png'/> 
            <span className="ml-2 sm:ml-0">
                Iniciar Sesion
            </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
