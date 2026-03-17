import "./Billing.css";

const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  maxLength,
  required
}) => {
  return (
    <div className="form-group">
      <label>{label} {required && "*"}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={error ? "input-error" : ""}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FormInput;
