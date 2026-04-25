import { useState, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Breadcrumbs from '../components/ui/breadcrumbs';
import { useBreadcrumbItems } from '../hooks/useBreadcrumbItems';

import '../style.css';

type BreadcrumbVariables = Record<string, string>;

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [breadcrumbVariables, setBreadcrumbVariables] = useState<BreadcrumbVariables>({});

  const setBreadcrumbVariable = useCallback(({ name, value }: { name: string; value: string }) => {
    setBreadcrumbVariables((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const breadcrumbItems = useBreadcrumbItems({
    pathname: location.pathname,
    breadcrumbVariables,
  });

  return (
    <Flex direction='column' h='100vh' minH={0}>
      <Box flex={1} minH={0} p={4}>
        <Box mb={4} py={3} borderBottomWidth='1px'>
          <Breadcrumbs items={breadcrumbItems} onNavigate={navigate} />
        </Box>

        <Outlet context={{ setBreadcrumbVariable }} />
      </Box>
    </Flex>
  );
};

export default App;
