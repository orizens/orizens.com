type InputProps = {
  htmlFor: string;
  label: string;
  type?: string;
  placeholder: string;
  [key: string]: any;
};

export function Input({
  htmlFor,
  label,
  type = 'text',
  placeholder,
  ...props
}: InputProps) {
  const FormComponent = type === 'textarea' ? type : 'input';
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-lg font-medium text-primary"
      >
        {label}
      </label>
      <FormComponent
        type={type}
        id={htmlFor}
        className="block w-full rounded-lg border border-primary bg-gray-900 p-3 text-xl text-gray-100 shadow-sm "
        placeholder={placeholder}
        required
        {...props}
      />
    </div>
  );
}
