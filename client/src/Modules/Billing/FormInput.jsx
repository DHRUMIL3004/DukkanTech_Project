import "./Billing.css";

const FormInput = ({
  label,
  type = "text",
  placeholder,
  max,
  disabled,
  min,
  value,
  onChange,
  error,
  maxLength,
  required,
}) => {
  return (
    <div className="form-group">
      <label>
        {label} {required && "*"}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        min={"1900-01-01"}
        max={max}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={error ? "input-error" : ""}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FormInput;
