/* eslint-disable */
import React, { useState } from 'react';
import { Modal, Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


// Styles for the modal box
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

const FeedbackModal = ({ open, handleClose, feedbackData }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="feedback-modal-title">
      <Box sx={modalStyle}>
        <Typography id="feedback-modal-title" variant="h6" component="h2" gutterBottom>
          Chi tiết đánh giá
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email khách</TableCell>
                <TableCell>Đánh giá</TableCell>
                <TableCell>Chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackData.map((row) => (
                <TableRow key={row.staffName}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.rating}</TableCell>
                  <TableCell>{row.feedback}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default FeedbackModal;
