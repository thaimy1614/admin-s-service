/* eslint-disable */
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Slide,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

const FormModal = ({ open, handleClose, onSubmit, formData }) => {
  console.log(formData.select);
  console.log(formData.choose)
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Slide}
      transitionDuration={500}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-paper': {
          padding: '16px',
          borderRadius: '16px',
          backgroundColor: '#fff',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'opacity 0.5s ease-in-out',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{formData.title}</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission
          onSubmit(formData.id);
        }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {formData.fields.map((field, index) => (
            <TextField
              value={field.value}
              key={index}
              label={field.label}
              type={field.type || 'text'}
              name={field.name}
              fullWidth
              margin="normal"
              required={field.required || false}
              onChange={field.onChange}
              disabled={field.disable || false}
              multiline={field.multiline || false}
              variant="outlined"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && field.multiline) {
                  e.stopPropagation(); // Ngăn form submit khi nhấn Enter
                }
              }}
            />
          ))}
          {formData.select?.categories && formData.select.categories.length && (
            <FormControl>

            <InputLabel id="category-label">Loại dịch vụ*</InputLabel>
            <Select
              required
              labelId="category-label"
              id="category"
              value={formData.choose || ''} // Ensure to set value correctly
              label="Loại dịch vụ"
              onChange={
                formData.select.onChange}
            >
              {formData.select.categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>

          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button onClick={handleClose} variant="outlined" sx={{ marginRight: 2 }}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: 'green', color: 'white' }}
          >
            {formData.submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormModal;
