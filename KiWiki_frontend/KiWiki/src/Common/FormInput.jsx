function FormInput({id,name,label,value,onChange,required = False, className}){
    return(
        <>
            <label htmlFor={id} className="font-bold">{label}</label>
            <input
            id={id}
            name = {name}
            type = "text"
            value={value}
            onChange = {onChange}
            required = {required}
            className = {className}
            /> 
        </>
    );
}

export default FormInput;