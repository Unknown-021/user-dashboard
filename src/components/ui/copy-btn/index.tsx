import { memo } from 'react';
import { Clipboard, IconButton } from '@chakra-ui/react';

interface Props {
  value: string;
}

const CopyBtn = ({ value }: Props) => {
  return (
    <Clipboard.Root value={value} timeout={1000}>
      <Clipboard.Trigger asChild>
        <IconButton variant='surface' size='xs'>
          <Clipboard.Indicator />
        </IconButton>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
};

export default memo(CopyBtn);
