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
import { stringify } from 'querystring';
import FeedbackModal from './feedback-modal';

// ----------------------------------------------------------------------

export function StaffRatingView() {
  const navigate = useNavigate();

  const table = useTable();
  const [open, setOpen] = useState(false);

  const [filterName, setFilterName] = useState('');
  const [staffs, setStaffs] = useState<
    {
      staffName: string;
      rating: number;
    }[]
  >([
    {
      staffName: '',
      rating: 0,
    },
  ]);
  const [staffDetail, setStaffDetail] = useState<{
    email: string,
    staffName: string;
    rating: number;
    feedback: string;
  }[]>([{
    email: '',
    staffName: '',
    rating: 0,
    feedback: '',
  }]);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: staffs,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const fetchStaffs = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_APP_API + '/admin/rating-staff', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setStaffs(data.result);

        console.log(staffs);
        return data.result;
      }
    } catch (error) {
      console.error('Error fetching staffs:', error);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      navigate('/sign-in');
    }
    fetchStaffs();
  }, [navigate]);

  const handleShow = (id: any) => {
    console.log(staffs);
    fetch(import.meta.env.VITE_APP_API + '/admin/rating-staff/find-by?name=' + id, {
      method: 'GET',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Response body:', data);
        if (data.result) {
          console.log(data.result);
          setStaffDetail(data.result);
          setOpen(true);
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Đánh giá nhân viên
        </Typography>
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
                rowCount={staffs.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    staffs.map((user) => user.staffName)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Tên nhân viên' },
                  { id: 'rating', label: 'Đánh giá' },
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
                      handleShow={handleShow}
                      key={row.staffName}
                      row={row}
                      selected={table.selected.includes(row.staffName)}
                      onSelectRow={() => table.onSelectRow(row.staffName)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, staffs.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={staffs.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
        />
      </Card>
      {open&&(
        <FeedbackModal 
        open={open} 
        handleClose={handleClose} 
        feedbackData={staffDetail}/>
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
