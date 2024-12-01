function FormInput({name,label,value,onChange,required = False, className}){
    return(
        <>
            <label className="font-bold">{label}</label>
            <input
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