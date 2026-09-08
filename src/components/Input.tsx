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
        className="mb-2 block text-sm font-semibold uppercase tracking-wider text-ink-muted"
      >
        {label}
      </label>
      <FormComponent
        name={htmlFor}
        type={type}
        id={htmlFor}
        className="block w-full rounded-xl border border-cool bg-cosmic-900/70 p-3 text-base text-ink-primary outline-none transition-colors placeholder:text-ink-subtle focus:border-cool-hover"
        placeholder={placeholder}
        required
        {...props}
      />
    </div>
  );
}
