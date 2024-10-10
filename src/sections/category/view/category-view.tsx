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
import MessageModal from 'src/components/common/message-modal';
import FormModal from 'src/components/common/form-modal';

// ----------------------------------------------------------------------

export function CategoryView() {
  const navigate = useNavigate();

  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [categories, setCategories] = useState<
    { id: string; name: string; description: string; benefits: string[], categoryStatus: string }[]
  >([
    {
      id: '',
      name: '',
      description: '',
      benefits: [],
      categoryStatus: '',
    },
  ]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [messageModalOpen, setMessageModal] = useState(false);
  const [messageType, setMessageType] = useState(false);
  const [message, setMessage] = useState('Đổi thông tin thành công!');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState('');

  const dataFiltered: UserProps[] = applyFilter({
    inputData: categories,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const fetchUsers = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/category', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setCategories(data.result);
        console.log(categories);
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

  const handleAddCategory = () => {
    console.log(name + description + benefits);
    fetch(import.meta.env.VITE_APP_API + '/admin/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        name: name,
        description: description,
        benefits: benefits,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result) {
          const newCategory = data.result;
          setCategories((prevCategories) => [...prevCategories, newCategory]);
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Thêm loại dịch vụ mới thành công!');
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
    console.log(benefits);
    fetch(import.meta.env.VITE_APP_API + '/admin/category/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        name: name,
        description: description,
        benefits: benefits,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result) {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === id ? { ...category, name, description, benefits } : category
            )
          );
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Chỉnh sửa thông tin thành công!');
          setMessageModal(true);
          setCategoryId('');
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
    const isEditMode = id > 0 ? true : false; // Xác định nếu đang ở chế độ chỉnh sửa
    return {
      title: isEditMode ? 'Chỉnh sửa loại dịch vụ' : 'Thêm loại dịch vụ mới',
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
          const categoryStatus = 'DELETED';
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === id ? { ...category, categoryStatus } : category
            )
          );
          setIsFormModalOpen(false);
          setMessageType(true);
          setMessage('Xóa loại dịch vụ thành công!');
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
    const category = categories.find((category) => category.id === id);
    setName(category?.name || '');
    setDescription(category?.description || '');
    setBenefits(category?.benefits || []);
    setCategoryId(id);
    setIsFormModalOpen(true);
    setMessageModal(false);
  };
  const handleShowAddForm = () => {
    setName('');
    setDescription('');
    setBenefits([]);
    setIsFormModalOpen(true);
    setMessageModal(false);
  };

  const formSubmitHandler = () => {
    if (categoryId !== null && categoryId !== '') {
      handleChangeCategory(categoryId); // Gọi hàm chỉnh sửa nếu có ID
    } else {
      handleShowAddForm(); // Gọi hàm thêm mới nếu không có ID
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Loại dịch vụ
        </Typography>
        <Button
          onClick={() => formSubmitHandler()}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Thêm loại dịch vụ
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
                rowCount={categories.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    categories.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'name', label: 'Tên' },
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, categories.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={categories.length}
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
          formData={checkOTPFormData(categoryId)}
          onSubmit={() => {
            if (categoryId !== null && categoryId !== '') {
              handleChangeCategory(categoryId);
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
