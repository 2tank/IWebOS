
function FormCheckBox({title,name,data,onChange,selectedElems}){
    return(
        <>
        <label className="text-white" >{title}</label>
        <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-2 mt-2">
            {data.map((e) => (
            <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                <div class="flex items-center ps-3">
                    <label key={e} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    <input
                    type="checkbox"
                    value={e}
                    name={name}
                    checked={selectedElems.includes(e)}
                    onChange={onChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    >
                    </input>
                    {" " + e}</label>
                </div>
            </li>
            ))}
        </ul>
        </>
    );
}

export default FormCheckBox;