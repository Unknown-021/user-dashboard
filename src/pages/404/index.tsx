import { Box, Button, Flex } from '@chakra-ui/react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/');
  };

  return (
    <Flex direction='column' alignItems='center'>
      <Flex direction='column' alignItems='center' mt='80px'>
        <Box textStyle='h1' color='colorForeground'>
          Что-то пошло не так
        </Box>
        <Box mt={4} textStyle='bodyMedium' color='colorForeground2'>
          Страница, которую вы запрашиваете, не существует
        </Box>
        <Button
          mt='54px'
          textStyle='bodyMedium'
          color='white'
          background='mainAccent'
          width='208px'
          height='48px'
          onClick={handleNavigate}
        >
          Вернуться на главную
        </Button>
      </Flex>
    </Flex>
  );
};

export default memo(ErrorPage);
