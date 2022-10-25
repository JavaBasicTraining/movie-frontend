import "../styles/text-field.css";

const TextField = ({ label, type, setValue, icon }) => {
    const onChange = (event) => {

        setValue(event.target.value);
    }
    return (<div className="text_field">
        {icon ?? <div className="label">{label}</div>} 
        {/* ?? = if(icon==null) else(label*/}
        <input type={type} onChange={onChange} placeholder={label} />
    </div>)
}
export default TextField;
