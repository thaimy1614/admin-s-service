/* eslint-disable */
import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import { getToken } from 'src/services/localStorageService';
import { useNavigate } from 'react-router-dom';
import FormModal from './form-modal';
import MessageModal from 'src/components/common/message-modal';
import { stringify } from 'querystring';

// ----------------------------------------------------------------------

export function HistoryView() {
  const navigate = useNavigate();

  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [orders, setOrders] = useState<
    {
      id: string;
      name: string;
      email: string;
      serviceName: string;
      stageName: string;
      createdDate: string;
      updatedDate: string;
      status: string;
      price: number;
      stageId: number;
      serviceId: number;
    }[]
  >([
    {
      id: '',
      name: '',
      email: '',
      serviceName: '',
      stageName: '',
      createdDate: '',
      updatedDate: '',
      price: 0,
      status: '',
      stageId: 0,
      serviceId: 0,
    },
  ]);

  useEffect(() => {
    console.log('Orders updated:', orders);
  }, [orders]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [messageModalOpen, setMessageModal] = useState(false);
  const [messageType, setMessageType] = useState(false);
  const [message, setMessage] = useState('Đổi thông tin thành công!');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [stageName, setStageName] = useState('');
  const [stageId, setStageId] = useState(0);
  const [price, setPrice] = useState(0);
  const [serviceName, setServiceName] = useState('');
  const [serviceId, setServiceId] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [services, setServices] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [stages, setStages] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: orders,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const fetchOrders = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/order', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setOrders(data.result);

        console.log(orders);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/service', {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        const simplifiedServices = data.result.content.map((service: { id: any; name: any }) => ({
          id: service.id,
          name: service.name,
        }));
        setServices(simplifiedServices);
        return data.result.content;
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  const fetchStages = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/stage', {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        const simplifiedStages = data.result.map((stage: { id: any; name: any }) => ({
          id: stage.id,
          name: stage.name,
        }));
        setStages(simplifiedStages);
        console.log(data.result);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate('/sign-in');
    }
    fetchOrders();
    fetchStages();
    fetchServices();
  }, [navigate]);

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setMessageModal(false);
  };

  const handleAddOrder = () => {
    fetch(import.meta.env.VITE_APP_API + '/admin/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        name: name,
        email: email,
        price: price,
        serviceId: serviceId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result) {
          const newOrder = data.result;
          setOrders((orders) => [...orders, newOrder]);
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Thêm đơn mới thành công!');
          setMessageModal(true);
          return;
        } else {
          setIsFormModalOpen(true);
          setMessageType(false);
          setMessage('Vui lòng nhập chính xác!');
          setMessageModal(true);
        }
      })
      .catch((error) => {
        setIsFormModalOpen(false);
        setMessageType(false);
        setMessage('Đã có lỗi xảy ra, vui lòng thử lại!');
        setMessageModal(true);
        console.log(error);
      });
  };

  const handleChangeOrder = (id: any) => {
    console.log(orders);
    fetch(import.meta.env.VITE_APP_API + '/admin/order/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        name: name,
        email: email,
        price: price,
        stageId: Number(stageId),
        serviceId: Number(serviceId),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result) {
          console.log
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === id ? { ...order, updatedDate:data.result.updatedDate,status: data.result.status, stageId, serviceId, name, email, serviceName: data.result.serviceName, stageName:data.result.stageName, price } : order
            )
          );
          

          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Chỉnh sửa thông tin thành công!');
          setMessageModal(true);
          setOrderId('');
          return;
        } else {
          setIsFormModalOpen(true);
          setMessageType(false);
          setMessage('Vui lòng nhập chính xác!');
          setMessageModal(true);
        }
      })
      .catch((error) => {
        setIsFormModalOpen(false);
        setMessageType(false);
        setMessage('Đã có lỗi xảy ra, vui lòng thử lại!');
        setMessageModal(true);
        console.log(error);
      });
  };

  const checkOTPFormData = (id: any) => {
    console.log('orderid: ' + id);
    const isEditMode = id && id !== '' ? true : false;
    return {
      title: isEditMode ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới',
      choose: serviceId,
      chooseStage: stageId,
      // Function to handle service selection
      select: {
        categories: services.length > 0 ? services : [],
        onChange: (e: React.ChangeEvent<{ value: unknown }>) => {
          const selectedService = services.find(
            (service) => service.id === Number(e.target.value) // Convert to number
          );
          if (selectedService) {
            setServiceName(selectedService.name);
            setServiceId(Number(selectedService.id)); // Ensure it's a number
            console.log('set id success');
          }
        },
      },
      // Function to handle stage selection
      selectStage: {
        stages: stages.length > 0 ? stages : [],
        onChange: (e: React.ChangeEvent<{ value: unknown }>) => {
          const selectedStage = stages.find(
            (stage) => stage.id === Number(e.target.value) // Convert to number
          );
          if (selectedStage) {
            setStageName(selectedStage.name);
            setStageId(Number(selectedStage.id)); // Ensure it's a number
          }
        },
      },

      fields: [
        {
          value: name,
          label: 'Tên',
          name: 'name',
          required: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
          type: 'text',
        },
        {
          value: email,
          label: 'Email',
          name: 'email',
          type: 'email',
          required: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
        },
        {
          value: price,
          label: 'Giá',
          name: 'price',
          type: 'number',
          required: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setPrice(e.target.value as unknown as number),
        },
      ],
      submitText: isEditMode ? 'Chỉnh sửa' : 'Thêm mới',
    };
  };

  const handleMessageModalClose = () => {
    setMessageModal(false);
  };

  const handleDelete = (id: any) => {
    console.log(id);
    fetch(import.meta.env.VITE_APP_API + '/admin/order/' + id, {
      method: 'DELETE',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result === true) {
          const status = 'DELETED';
          setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === id ? { ...order, status } : order))
          );
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Xóa đơn thành công!');
          setMessageModal(true);
          return;
        }
      })
      .catch((error) => {
        setIsFormModalOpen(false);
        setMessageType(false);
        setMessage('Đã có lỗi xảy ra, vui lòng thử lại!');
        setMessageModal(true);
        console.log(error);
      });
  };

  const handleShowUpdateForm = (id: any) => {
    const order = orders.find((order) => order.id === id);
    setName(order?.name || '');
    setEmail(order?.email || '');
    setServiceId(order?.serviceId || 0);
    setStageId(order?.stageId || 0);
    setPrice(order?.price || 0);
    setOrderId(id);
    setIsFormModalOpen(true);
    setMessageModal(false);
  };
  const handleShowAddForm = () => {
    setName('');
    setEmail('');
    setPrice(0);
    setServiceName('');
    setStageId(0);
    setServiceId(0);
    setOrderId('');
    setIsFormModalOpen(true);
    setMessageModal(false);
  };

  const formSubmitHandler = () => {
    if (orderId !== null && orderId !== '') {
      handleChangeOrder(orderId); // Gọi hàm chỉnh sửa nếu có ID
    } else {
      handleShowAddForm(); // Gọi hàm thêm mới nếu không có ID
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Lịch sử đơn
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => handleShowAddForm()}
        >
          Thêm đơn mới
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={orders.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    orders.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Tên' },
                  { id: 'email', label: 'Email' },
                  { id: 'serviceName', label: 'Tên dịch vụ' },
                  { id: 'price', label: 'Giá' },
                  { id: 'stageName', label: 'Tiến độ' },
                  { id: 'createdDate', label: 'Ngày tạo' },
                  { id: 'updatedDate', label: 'Ngày chỉnh sửa' },
                  { id: 'status', label: 'Trạng thái' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
                      handleUpdate={handleShowUpdateForm}
                      handleDelete={handleDelete}
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, orders.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={orders.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
        />
      </Card>
      {messageModalOpen && (
        <MessageModal
          message={message}
          open={messageModalOpen}
          handleClose={handleMessageModalClose}
          messageType={messageType}
        />
      )}
      {isFormModalOpen && (
        <FormModal
          handleClose={handleFormModalClose}
          open={isFormModalOpen}
          formData={checkOTPFormData(orderId)}
          onSubmit={() => {
            if (orderId !== null && orderId !== '') {
              handleChangeOrder(orderId);
            } else {
              handleAddOrder();
            }
          }}
        />
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
