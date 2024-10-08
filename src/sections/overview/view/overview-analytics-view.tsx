/* eslint-disable */
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { useEffect, useState } from 'react';
import { getToken } from 'src/services/localStorageService';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const navigate = useNavigate();
  const [countUser, setCountUser] = useState(0);
  const [countService, setCountService] = useState(0);
  const [countOrder, setCountOrder] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [categoryAnalysis, setCategoryAnalysis] = useState([]);

  const fetchCountServices = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/service/count', {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        setCountService(data.result);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  const fetchCountUser = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/user/count', {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        setCountUser(data.result);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const fetchCountOrder = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/order/count', {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        setCountOrder(data.result);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  const fetchTotalRevenue = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/order/total-revenue', {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        setTotalRevenue(data.result);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  };
  const fetchCategoryAnalysis = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/order/analyze-category', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setCategoryAnalysis(data.result);
        console.log(categoryAnalysis);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching category analysis:', error);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate('/sign-in');
    } else {
      fetchCountServices();
      fetchCountOrder();
      fetchCountUser();
      fetchTotalRevenue();
      fetchCategoryAnalysis();
    }
  }, [navigate]);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tổng Số Dịch Vụ"
            // percent={2.6}
            total={countService}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg" />}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [22, 8, 35, 50, 82, 84, 77, 12],
            // }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tổng Số Người Dùng"
            // percent={-0.1}
            total={countUser}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [56, 47, 40, 62, 73, 30, 23, 54],
            // }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Lượt Đặt Dịch Vụ"
            // percent={2.8}
            total={countOrder}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg" />}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [40, 70, 50, 28, 70, 75, 7, 64],
            // }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Doanh Thu"
            // percent={3.6}
            total={totalRevenue}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg" />}
            // chart={{
            //   categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            //   series: [56, 30, 23, 54, 47, 40, 62, 73],
            // }}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AnalyticsCurrentVisits
            title="Loại Dịch Vụ Được Đặt"
            chart={{
              series: categoryAnalysis || [],
            }}
          />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
