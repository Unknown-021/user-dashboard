import { useMemo } from 'react';
import type { IBreadcrumb } from '../components/ui/breadcrumbs';
import loadingBreadcrumb from '../constants/loadingBreadcrumb';
import { SEGMENT_TITLES } from '../router/paths';

type BreadcrumbVariables = Record<string, string>;

interface Props {
  pathname: string;
  breadcrumbVariables: BreadcrumbVariables;
}

export const useBreadcrumbItems = ({ pathname, breadcrumbVariables }: Props): IBreadcrumb[] => {
  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);

    if (!segments.length) {
      return [
        {
          id: 'home',
          title: 'Home',
          href: '/',
          isCurrentPage: true,
          isDisableLink: true,
        },
      ];
    }

    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      const isCurrentPage = index === segments.length - 1;

      let title = SEGMENT_TITLES[segment] || segment;

      if (segments[0] === 'users' && index === 1) {
        title = breadcrumbVariables.userItem || loadingBreadcrumb;
      }

      const isUserItemCrumb = segments[0] === 'users' && index === 1;

      return {
        id: href,
        title,
        href,
        isCurrentPage,
        isDisableLink: isCurrentPage || isUserItemCrumb,
      };
    });
  }, [pathname, breadcrumbVariables]);
};
