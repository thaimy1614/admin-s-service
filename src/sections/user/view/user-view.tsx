/* eslint-disable */
import { useState, useCallback, useEffect, SetStateAction } from 'react';

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

export function UserView() {
  const navigate = useNavigate();

  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [users, setUsers] = useState([
    {
      id: '',
      name: '',
      email: '',
      address: '',
      phone: '',
      status: 'ACTIVE',
    },
  ]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [messageModalOpen, setMessageModal] = useState(false);
  const [messageType, setMessageType] = useState(false);
  const [message, setMessage] = useState('Đổi thông tin thành công!');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState('');

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const fetchUsers = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/user', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUsers(data.result.content);
        console.log(users);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching category analysis:', error);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate('/sign-in');
    }

    fetchUsers();
  }, [navigate]);

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setMessageModal(false);
  };

  const handleChangeUserInfo = (id: any) => {
    console.log(id);
    fetch(import.meta.env.VITE_APP_API + '/admin/user/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        address: address,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result) {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === id ? { ...user, name, phone, address } : user))
          );
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Chỉnh sửa thông tin thành công!');
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

  const checkOTPFormData = (id: any) => {
    return {
      title: 'Chỉnh sửa thông tin khách hàng',
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
          value: phone,
          label: 'Số điện thoại',
          name: 'phone',
          type: 'text',
          required: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value),
        },
        {
          value: address,
          label: 'Địa chỉ',
          name: 'address',
          type: 'text',
          required: true,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value),
        },
      ],
      submitText: 'Chỉnh sửa',
    };
  };

  const handleMessageModalClose = () => {
    setMessageModal(false);
  };

  const handleDelete = (id: any) => {
    console.log(id);
    fetch(import.meta.env.VITE_APP_API + '/admin/user/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        address: address,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result===true) {
          const status = "DELETED"
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === id ? { ...user, status,  } : user))
          );
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Xóa tài khoản khách hàng thành công!');
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
    const user = users.find((user) => user.id === id);
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setAddress(user?.address || '');
    setUserId(id);
    setIsFormModalOpen(true);
    setMessageModal(false);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Khách hàng
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Khách hàng mới
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
                rowCount={users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Tên' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Số điện thoại' },
                  { id: 'address', label: 'Địa chỉ' },
                  { id: 'isVerified', label: 'Trạng thái' },
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={users.length}
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
          formData={checkOTPFormData(userId)}
          onSubmit={() => handleChangeUserInfo(userId)}
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
