import type { ChangeEvent } from 'react';
import { Field, Input } from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import type { FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';

type InputFieldProps<TFieldValues extends FieldValues> = Omit<InputProps, 'name'> & {
  name: Path<TFieldValues>;
  label?: string;
  helperText?: string;
  register: UseFormRegister<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: string;
  required?: boolean;
  mask?: (value: string) => string;
};

export function InputField<TFieldValues extends FieldValues>({
  name,
  label,
  helperText,
  register,
  rules,
  error,
  required,
  mask,
  ...inputProps
}: InputFieldProps<TFieldValues>) {
  const registration = register(name, rules);
  const inputPropsOnChange = inputProps.onChange;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (mask) {
      event.target.value = mask(event.target.value);
    }

    registration.onChange(event);
    inputPropsOnChange?.(event);
  };

  return (
    <Field.Root required={required} invalid={!!error}>
      {label ? <Field.Label>{label}</Field.Label> : null}

      <Input {...registration} {...inputProps} onChange={handleChange} />

      {helperText && !error ? <Field.HelperText>{helperText}</Field.HelperText> : null}

      {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
    </Field.Root>
  );
}

export default InputField;
