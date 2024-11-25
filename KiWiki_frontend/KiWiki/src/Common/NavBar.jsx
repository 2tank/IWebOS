import { Link, useLocation } from 'react-router-dom'; 
import SearchBar from './SearchBar'; 
import Avatar from '@mui/material/Avatar';

const Navbar = () => {
  const location = useLocation();
  const shouldShowSearchBar = location.pathname !== "/";

  return (
    <nav className="flex items-center justify-between px-5 bg-yellow-950 text-white">
      <div className="flex items-center">
        <Link to="/" className="hover:opacity-80">
            <Avatar sx={{ width: 80, height: 80 }} src='/assets/logo_wiki_blanco.png'/>
        </Link>
      </div>

      <div className="flex-grow flex justify-center">
        {shouldShowSearchBar && <SearchBar/>}
      </div>

      <div className='flex items-center mt-2 sm:mt-0'>
      <Link to="/" className="hover:opacity-80 flex items-center flex-col">
            <Avatar src='/src/assets/image.png'/> 
            <span>
                Iniciar Sesion
            </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
