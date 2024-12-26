function FormTextArea({name,label,value,onChange,required = False, className, onKeyDown}){
    return(
        <>
            <label className="font-bold">{label}</label>
            <textarea
            name = {name}
            value={value}
            onChange = {onChange}
            required = {required}
            onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className = {`${className} rounded`}
            onKeyDown={onKeyDown}
            rows={value.split('\n').length || 10}
            /> 
        </>
    );
}

export default FormTextArea;