import { Box } from '@chakra-ui/react';
import { memo, type ReactNode, useEffect, useRef, useState } from 'react';

interface Props {
  children: ReactNode;
  bottomOffset?: number;
}

const FullHeightScrollBox = ({ children, bottomOffset = 16 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(400);

  useEffect(() => {
    const updateHeight = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const nextHeight = Math.max(window.innerHeight - rect.top - bottomOffset, 200);

      setHeight(nextHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(document.body);
    window.addEventListener('resize', updateHeight);
    window.addEventListener('scroll', updateHeight, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('scroll', updateHeight, true);
    };
  }, [bottomOffset]);

  return (
    <Box ref={ref} height={`${height}px`} minH='200px' overflow='hidden' position='relative'>
      {children}
    </Box>
  );
};

export default memo(FullHeightScrollBox);
