/* eslint-disable */

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { getToken, removeToken, setToken } from 'src/services/localStorageService';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export function SignInView() {
  const navigate = useNavigate();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    if(getToken()){
      removeToken();
    }
  },)

  const handleSignIn = async (event: { preventDefault: () => void; }) => {
    // setModalOpen(false);
    event.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.VITE_APP_API + "/identity/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: username,
            password: password,
          }),
        }
      );
      const data = await response.json();
      // switch(data.code){
      //   case 1005:
      //     setFailMessage("Tài khoản không tồn tại!");
      //     setModalOpen(true);
      //     return;
      //   case 1008:
      //     setFailMessage("Tên đăng nhập hoặc mật khẩu không chính xác!");
      //     setModalOpen(true);
      //     return;
      //   case 1016:
      //     setFailMessage("Tài khoản chưa được xác thực, vui lòng kiểm tra email!");
      //     setModalOpen(true);
      //     return;
      //   default:
      //     break;
      // }
      if (response.ok && data.result.role === "ADMIN") {
        console.log("Response body:", data);
        setToken(data.result.token); // Save the token to local storage
        navigate("/");
      } else {
        console.error("Login failed", data);
        // setModalOpen(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      // setFailMessage("Đã có lỗi xảy ra, vui lòng thử lại!")
      // setModalOpen(true);
    }
  };


  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="username"
        label="Username"
        value={username}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        fullWidth
        name="password"
        value={password}
        label="Password"
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        onChange={(e) => setPassword(e.target.value)}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="button"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
      </Box>

      {renderForm}
    </>
  );
}
