function FormInput({name,label,value,onChange,required = False, className, readOnly = false}){
    return(
        <>
            <label className="font-bold">{label}</label>
            <input
            name = {name}
            type = "text"
            value={value}
            readOnly={readOnly}
            onChange = {onChange}
            required = {required}
            className = {`${className} rounded`}
            /> 
        </>
    );
}

export default FormInput;