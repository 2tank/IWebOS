import { useEffect, useState, useRef } from "react"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function CommentaryFilters({setOrderByNewest, setOrderByOldest, setFilterUser}) {

    const[user, setUser] = useState('');
    const [orderBy, setOrderBy] = useState('newest');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null); // Referencia para el contenedor del select

    // Manejo de clics fuera del select
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setIsOpen(false); // Cerrar el select y restablecer la flecha
            }
        };

        document.addEventListener('mousedown', handleClickOutside); // Escuchar clics
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Limpiar el evento
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFilterUser(user);

        if (orderBy === 'newest') {
            setOrderByNewest(true);
            setOrderByOldest(false);
        } else if (orderBy == 'oldest') {
            setOrderByNewest(false);
            setOrderByOldest(true);
        } else {
            setOrderByNewest(false);
            setOrderByOldest(false);
        }
    }

    const clean = () => {
        setUser('');
        setOrderBy('newest');
        setIsOpen(false);
        setOrderByNewest(false);
        setOrderByOldest(false);
        setFilterUser(null);
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div className='border-2 border-gray-300 bg-gray-300 rounded-xl pl-5 pr-2 pb-2 pt-5 hover:shadow-sm text-sm sm:text-base mb-2'>
                <div className="flex flex-row mb-2">
                    <h1 className='font-bold underline'>Filtrado de comentarios: </h1>
                </div>
                <form onSubmit={handleSubmit} className='space-y-2'>
                    <div className='flex flex-row flex-wrap space-x-4 space-y-2 items-center'>
                        <div className="flex-col">
                            <label>Nombre de usuario:</label>
                            <input
                                type="text"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                className='appearance-none caret-gray-800 border-gray-600 border-b-2 focus:outline-none
                                h-fit w-auto ml-2 flex-row flex-shrink flex-grow-0 bg-gray-300'
                            />
                        </div>
                        <div className="flex flex-col" ref={selectRef}>
                            <div className="flex flex-row items-center">
                                <label>Ordenar por:</label>
                                <div className="items-center border-gray-600 border-2 rounded-md p-1  ml-2">
                                    <select
                                        value={orderBy}
                                        onChange={(e) => setOrderBy(e.target.value)}
                                        onClick={toggleDropdown}
                                        className='appearance-none focus:outline-none
                                        h-fit w-auto flex-shrink flex-grow-0 bg-gray-300'
                                    >
                                        <option value="newest">Más recientes primero</option>
                                        <option value="oldest">Más antiguos primero</option>
                                    </select>
                                    <ArrowDropDownIcon 
                                        className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-x-1">
                        <div className="flex px-2 py-1 rounded-full text-black font-normal
                        transition hover:duration-0 ease-out duration-300
                        hover:bg-gray-100 hover:shadow-sm">
                        <button type="button" onClick={clean}>Limpiar filtros</button>
                        </div>
                        <div className="flex px-2 py-1 rounded-full text-black font-semibold
                        transition hover:duration-0 ease-out duration-300
                        hover:bg-blue-100 hover:shadow-sm">
                        <button type="submit">Enviar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CommentaryFilters