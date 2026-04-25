import { memo, useEffect, useMemo, useState } from 'react';
import { Input } from '@chakra-ui/react';
import debounce from 'lodash/debounce';

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const DEBOUNCE_MS = 600;

const Search = ({ value, onChange, placeholder = 'Search' }: SearchProps) => {
  const [localValue, setLocalValue] = useState(value);

  const debouncedChange = useMemo(
    () =>
      debounce((nextValue: string) => {
        onChange(nextValue);
      }, DEBOUNCE_MS),
    [onChange],
  );

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  }, [debouncedChange]);

  const onInputChange = (nextValue: string) => {
    setLocalValue(nextValue);
    debouncedChange(nextValue);
  };

  return (
    <Input
      value={localValue}
      onChange={(event) => onInputChange(event.target.value)}
      placeholder={placeholder}
      maxW='sm'
    />
  );
};

export default memo(Search);
