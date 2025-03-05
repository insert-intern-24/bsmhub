const Input = ({
  placeholder,
  id,
  type = 'text',
  name,
}: {
  placeholder: string;
  id?: string;
  type?: string;
  name?: string;
}) => {
  return (
    <input
      id={id}
      type={type}
      className="bg-[#f5f5f7] py-4 px-2.5 w-full text-base"
      placeholder={placeholder}
      name={name}
    />
  );
};

const InputWithLabel = ({
  label,
  placeholder,
  id,
  type = 'text',
  name,
}: {
  label: string;
  placeholder: string;
  id?: string;
  type?: string;
  name?: string;
}) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <Input placeholder={placeholder} id={id} type={type} name={name} />
    </div>
  );
};
export { Input, InputWithLabel };
