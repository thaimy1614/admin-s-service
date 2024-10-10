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
import FormModal from 'src/components/common/form-modal';
import MessageModal from 'src/components/common/message-modal';

// ----------------------------------------------------------------------

export function ServiceView() {
  const navigate = useNavigate();

  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [services, setServices] = useState<
    { id: string; name: string; categoryName: string; description: string; benefits: string[], serviceStatus: string }[]
  >([
    {
      id: '',
      name: '',
      description: '',
      categoryName: '',
      benefits: [],
      serviceStatus: '',
    },
  ]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [messageModalOpen, setMessageModal] = useState(false);
  const [messageType, setMessageType] = useState(false);
  const [message, setMessage] = useState('Đổi thông tin thành công!');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [categories, setCategories] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: services,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const fetchServices = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/service', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setServices(data.result.content);
        console.log(services);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching service:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/category', {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        const simplifiedCategories = data.result.map((category: { id: any; name: any }) => ({
          id: category.id,
          name: category.name,
        }));
        setCategories(simplifiedCategories);
        console.log(categories);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate('/sign-in');
    }

    fetchServices();
    fetchCategories();
  }, [navigate]);

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setMessageModal(false);
  };

  const handleAddCategory = () => {
    fetch(import.meta.env.VITE_APP_API + '/admin/service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        name: name,
        description: description,
        benefits: benefits,
        categoryName: categoryName,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result) {
          const newService = data.result;
          setServices((services) => [...services, newService]);
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Thêm dịch vụ mới thành công!');
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

  const handleChangeCategory = (id: any) => {
    console.log(categories);
    fetch(import.meta.env.VITE_APP_API + '/admin/service/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        name: name,
        description: description,
        categoryName: categoryName,
        benefits: benefits,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result) {
          setServices((prevServices) =>
            prevServices.map((service) =>
              service.id === id
                ? { ...service, name, description, categoryName, benefits }
                : service
            )
          );
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Chỉnh sửa thông tin thành công!');
          setMessageModal(true);
          setServiceId('');
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
    const isEditMode = id > 0 ? true : false;
    return {
      title: isEditMode ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới',
      choose: categoryName,
      select: {
        categories: categories.length > 0 ? categories : [],
        onChange: (e: React.ChangeEvent<{ value: unknown }>) => setCategoryName(e.target.value as string),
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
          value: description,
          label: 'Mô tả',
          name: 'description',
          type: 'text',
          required: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value),
        },
        {
          value: benefits.join('\n'),
          label: 'Lợi ích',
          name: 'benefits',
          type: 'text',
          multiline: true,
          rows: 4,
          required: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            const benefitsArray = inputValue.split('\n');
            setBenefits(benefitsArray);
          },
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
    fetch(import.meta.env.VITE_APP_API + '/admin/category/' + id, {
      method: 'DELETE',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result === true) {
          const serviceStatus = 'DELETED';
          setServices((prevServices) =>
            prevServices.map((service) => (service.id === id ? { ...service, serviceStatus } : service))
          );
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Xóa dịch vụ thành công!');
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
    console.log('?' + categories);
    const service = services.find((service) => service.id === id);
    setName(service?.name || '');
    setDescription(service?.description || '');
    setCategoryName(service?.categoryName || '');
    setBenefits(service?.benefits || []);
    setServiceId(id);
    setIsFormModalOpen(true);
    setMessageModal(false);
  };
  const handleShowAddForm = () => {
    setName('');
    setDescription('');
    setBenefits([]);
    setCategoryName('');
    setIsFormModalOpen(true);
    setMessageModal(false);
  };

  const formSubmitHandler = () => {
    if (serviceId !== null && serviceId !== '') {
      handleChangeCategory(serviceId); // Gọi hàm chỉnh sửa nếu có ID
    } else {
      handleShowAddForm(); // Gọi hàm thêm mới nếu không có ID
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Dịch vụ
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => formSubmitHandler()}
        >
          Thêm dịch vụ
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
                rowCount={services.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    services.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Tên' },
                  { id: 'category', label: 'Loại dịch vụ' },
                  { id: 'description', label: 'Mô tả' },
                  { id: 'benefits', label: 'Lợi ích' },
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, services.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={services.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
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
          formData={checkOTPFormData(serviceId)}
          onSubmit={() => {
            if (serviceId !== null && serviceId !== '') {
              handleChangeCategory(serviceId);
            } else {
              handleAddCategory();
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
