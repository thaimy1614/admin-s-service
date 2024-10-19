import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Thống kê',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Khách hàng',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Loại dịch vụ',
    path: '/category',
    icon: icon('ic-blog'),
  },
  {
    title: 'Dịch vụ',
    path: '/service',
    icon: icon('ic-blog'),
  },
  {
    title: 'Lịch sử',
    path: '/history',
    icon: icon('ic-cart'),
  },
  {
    title: 'Đánh giá',
    path: '/rating-staff',
    icon: icon('ic-user'),
  },
  {
    title: 'Đăng xuất',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
];
