import { memo, useEffect, Fragment } from 'react';
import { Breadcrumb, Flex, Text } from '@chakra-ui/react';
import { MdChevronRight } from 'react-icons/md';
import loadingBreadcrumb from '../../../constants/loadingBreadcrumb';

export interface IBreadcrumb {
  title: string;
  href: string;
  id: string;
  isCurrentPage?: boolean;
  isDisableLink?: boolean;
}

interface Props {
  items: IBreadcrumb[];
  onNavigate: (href: string) => void;
}

interface BreadcrumbsVariablePayload {
  name: string;
  value: string;
}

interface BreadcrumbsSyncProps {
  isReady: boolean;
  value: string | null | undefined;
  name: string;
  onSetVariable: (payload: BreadcrumbsVariablePayload) => void;
  loadingValue?: string;
}

export const BreadcrumbsVariableSync = ({
  isReady,
  value,
  name,
  onSetVariable,
  loadingValue = loadingBreadcrumb,
}: BreadcrumbsSyncProps) => {
  useEffect(() => {
    if (isReady && value) {
      onSetVariable({ name, value });
      return;
    }

    onSetVariable({ name, value: loadingValue });
  }, [isReady, value, name, onSetVariable, loadingValue]);

  return null;
};

const Breadcrumbs = ({ items, onNavigate }: Props) => {
  return (
    <Breadcrumb.Root size='md'>
      <Breadcrumb.List gap='2'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          const content = (
            <Flex align='center' gap='2' maxW='100%' minW={0} whiteSpace='nowrap'>
              <Text as='span' truncate={isLast} maxW={isLast ? 'calc(100vw - 720px)' : '100%'}>
                {item.title}
              </Text>
            </Flex>
          );

          return (
            <Fragment key={item.id}>
              <Breadcrumb.Item maxW={isLast ? '100%' : 'auto'}>
                {item.isCurrentPage ? (
                  <Breadcrumb.CurrentLink
                    color='fg.muted'
                    cursor='default'
                    _hover={{ textDecoration: 'none' }}
                    maxW='100%'
                  >
                    {content}
                  </Breadcrumb.CurrentLink>
                ) : item.isDisableLink ? (
                  <Text as='span' color='fg' maxW='100%'>
                    {content}
                  </Text>
                ) : (
                  <Breadcrumb.Link
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.href);
                    }}
                    cursor='pointer'
                    color='blue.500'
                    maxW='100%'
                  >
                    {content}
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>

              {!isLast && (
                <Breadcrumb.Separator color='fg.muted'>
                  <MdChevronRight />
                </Breadcrumb.Separator>
              )}
            </Fragment>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};

export default memo(Breadcrumbs);
