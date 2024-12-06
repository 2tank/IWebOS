import { useState, useEffect } from 'react';

function FormCheckBox({ label, name, data, onChange, selectedElems, className }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const filteredData = data.filter((e) =>
        e.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    return (
        <>
            <label className="block font-bold mb-2">{label}</label>
            <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/2 mb-2 px-2 py-1 border rounded bg-gray-300 "
            />
            <ul className={className}>
                {filteredData.map((e) => (
                    <li
                        key={e}
                        className="flex py-2 border-b border-gray-200 dark:border-gray-600"
                    >
                        <label className="flex text-sm font-medium text-gray-900 dark:text-gray-300">
                            <input
                                type="checkbox"
                                value={e}
                                name={name}
                                checked={selectedElems.includes(e)}
                                onChange={onChange}
                            />
                            <span className="ml-2">{e}</span>
                        </label>
                    </li>
                ))}
                {filteredData.length === 0 && (
                    <li className="text-white text-sm italic">No hay resultados</li>
                )}
            </ul>
        </>
    );
}
export default FormCheckBox;
