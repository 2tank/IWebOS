function FormTextArea({id,name,label,value,onChange,required = False, className}){
    return(
        <>
            <label htmlFor={id} className="text-white">{label}</label>
            <textarea
            id={id}
            name = {name}
            value={value}
            onChange = {onChange}
            required = {required}
            className = {className}
            wrap="soft"
            rows="10"
            /> 
        </>
    );
}

export default FormTextArea;