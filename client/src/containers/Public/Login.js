import { Alert, Box, Button, TextField } from "@mui/material";
import React, { memo } from "react";
import { IoMdClose } from "react-icons/io";
import { useLogin } from "../../hooks";

const Login = ({ setIsModelLogin }) => {
  const { isLogin, error, invalidKeys, handleInputChange, handleKeyDown, handleSubmit, setIsLogin } =
    useLogin(setIsModelLogin);

  return (
    <Box
      id="box"
      key="box"
      className="scrollbar-hide"
      sx={{
        display: "flex",
        justifyContent: "center",
        justifyItems: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        bgcolor: "rgba(0, 0, 0, 0.6)",
        position: "fixed",
        overflowY: "auto",
        zIndex: 99,
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      {isLogin ? (
        <Box
          id="box-container"
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
            bgcolor: "white",
            width: "90%",
            height: "fit-content",
            maxHeight: "fit-content",
            minHeight: "25rem",
            maxWidth: "30rem",
            minWidth: "20rem",
            borderRadius: "28px",
            paddingX: 1,
            paddingY: 5,
            margin: "auto",
          }}
        >
          <div className="relative w-full">
            <div
              onClick={() => {
                setIsModelLogin(false);
              }}
              className="absolute right-[-8px] top-[-40px] flex h-12 w-14 cursor-pointer items-center justify-center rounded-es-[25px] rounded-se-[25px] bg-primary-color shadow-md hover:bg-secondary-color"
            >
              <IoMdClose color="white" fontSize={25} width={30} height={30} />
            </div>
            <h1 className="pb-6 text-center text-3xl font-bold text-primary-color">ĐĂNG NHẬP</h1>
            <div className="flex flex-col items-center justify-center gap-y-8">
              {error && (
                <Alert className="w-[80%]" severity="error">
                  {error}
                </Alert>
              )}
              <TextField
                className="w-[80%]"
                label="Tài khoản"
                variant="filled"
                name="username"
                required
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              ></TextField>
              <TextField
                type="password"
                autoComplete="off"
                className="w-[80%]"
                label="Mật khẩu"
                variant="filled"
                name="password"
                required
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              ></TextField>
              <Button className="h-12 w-[80%]" type="submit" size="large" variant="contained" onClick={handleSubmit}>
                Đăng Nhập
              </Button>
              <p>
                Bạn chưa có tài khoản?{" "}
                <span
                  className="cursor-pointer text-primary-color hover:text-primary-color hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Tạo tài khoản
                </span>
              </p>
            </div>
          </div>
        </Box>
      ) : (
        <Box
          id="box-container"
          sx={{
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
            bgcolor: "white",
            width: "90%",
            height: "fit-content",
            maxHeight: "fit-content",
            minHeight: "30rem",
            maxWidth: "30rem",
            minWidth: "20rem",
            borderRadius: "28px",
            paddingX: 1,
            paddingY: 5,
            margin: "auto",
          }}
        >
          <div onSubmit={handleSubmit} className="relative w-full">
            <div
              onClick={() => {
                setIsModelLogin(false);
              }}
              className="absolute right-[-8px] top-[-40px] flex h-12 w-14 cursor-pointer items-center justify-center rounded-es-[25px] rounded-se-[25px] bg-primary-color shadow-md hover:bg-secondary-color"
            >
              <IoMdClose color="white" fontSize={25} width={30} height={30} />
            </div>
            <h1 className="pb-4 text-center text-3xl font-bold text-primary-color">ĐĂNG KÝ</h1>
            <div className="flex flex-col items-center justify-center gap-2 align-middle">
              {error && (
                <Alert className="w-[80%]" severity="error">
                  {error}
                </Alert>
              )}
              <div className="flex w-[80%] gap-2">
                <TextField
                  className="w-full"
                  label="Họ"
                  variant="filled"
                  name="firstName"
                  helperText={invalidKeys?.firstName}
                  error={invalidKeys?.firstName}
                  required
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                ></TextField>
                <TextField
                  className="w-full"
                  label="Tên"
                  variant="filled"
                  name="lastName"
                  helperText={invalidKeys?.lastName}
                  error={invalidKeys?.lastName}
                  required
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                ></TextField>
              </div>
              <div className="w-[80%]">
                <TextField
                  className="w-full"
                  label="Email"
                  variant="filled"
                  name="email"
                  helperText={invalidKeys?.email}
                  error={invalidKeys?.email}
                  required
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                ></TextField>
              </div>
              <div className="flex w-[80%] gap-2">
                <TextField
                  className="w-full"
                  label="Số điện thoại"
                  variant="filled"
                  name="phone"
                  helperText={invalidKeys?.phone}
                  error={invalidKeys?.phone}
                  required
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                ></TextField>
                <TextField
                  className="w-full"
                  label="Ngày sinh"
                  variant="filled"
                  type="date"
                  name="dob"
                  InputLabelProps={{ shrink: true }}
                  helperText={invalidKeys?.dob}
                  error={invalidKeys?.dob}
                  required
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                ></TextField>
              </div>
              <div className="w-[80%]">
                <TextField
                  className="w-full"
                  label="Tài khoản"
                  variant="filled"
                  name="username"
                  helperText={invalidKeys?.username}
                  error={invalidKeys?.username}
                  required
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                ></TextField>
              </div>
              <div className="w-[80%]">
                <TextField
                  id="password1"
                  className="w-full"
                  label="Mật khẩu"
                  variant="filled"
                  name="password"
                  type="password"
                  helperText={invalidKeys?.password}
                  error={invalidKeys?.password}
                  required
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                ></TextField>
              </div>
              <div className="w-[80%]">
                <TextField
                  id="password2"
                  className="w-full"
                  label="Nhập lại mật khẩu"
                  variant="filled"
                  name="re_password"
                  type="password"
                  required
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                ></TextField>
              </div>
              <Button className="h-12 w-[80%]" type="submit" size="large" variant="contained" onClick={handleSubmit}>
                Đăng Ký
              </Button>
              <p>
                Bạn đã có tài khoản?{" "}
                <span
                  className="cursor-pointer text-primary-color hover:text-primary-color hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Đăng nhập ngay
                </span>
              </p>
            </div>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default memo(Login);
