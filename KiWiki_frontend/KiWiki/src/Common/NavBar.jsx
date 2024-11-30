import { Link, useLocation } from 'react-router-dom'; 
import SearchBar from './SearchBar'; 
import Avatar from '@mui/material/Avatar';

const Navbar = () => {
  const location = useLocation();
  const shouldShowSearchBar = location.pathname !== "/";

  return (
    <nav className="w-full flex flex-col sm:flex-row items-center justify-between p-4 bg-green-900 text-white">
      <div className="flex items-center">
        <Link to="/" className="hover:opacity-80">
            <Avatar sx={{ width: 80, height: 80 }} src='/assets/logo_wiki_blanco.png'/>
        </Link>
      </div>

      <div className="flex-grow flex justify-center mb-2 sm:mb-0">
        {shouldShowSearchBar && <SearchBar/>}
      </div>

      <div className='flex items-center mt-2 sm:mt-0'>
      <Link to="/" className="hover:opacity-80 flex items-center flex-col">
            <Avatar src='/src/assets/image.png'/> 
            <span className="ml-2 sm:ml-0">
                Iniciar Sesion
            </span>
        </Link>
        <i className="fas fa-bell ml-4"></i>
      </div>
    </nav>
  );
};

export default Navbar;
