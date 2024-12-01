function FormInput({name,label,value,onChange,required = False, className, max, min}){
    return(
        <>
            <label className="font-bold">{label}</label>
            <input
            name = {name}
            type = "number"
            value={value}
            onChange = {onChange}
            required = {required}
            className = {className}
            max={max}
            min={min}
            /> 
        </>
    );
}

export default FormInput;