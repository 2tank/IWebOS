function FormTextArea({name,label,value,onChange,required = False, className}){
    return(
        <>
            <label className="font-bold">{label}</label>
            <textarea
            name = {name}
            value={value}
            onChange = {onChange}
            required = {required}
            className = {`${className} rounded`}
            wrap="soft"
            rows="10"
            /> 
        </>
    );
}

export default FormTextArea;