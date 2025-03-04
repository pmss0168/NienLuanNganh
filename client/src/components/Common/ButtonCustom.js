import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as action from "../../store/actions";
import { path } from "../../utils/constant";
import { formatLengthName } from "../../utils/format";

const defaultAvatar = require("../../assets/images/profile.png");

const ButtonCustom = ({
  TypeButton,
  IconBefore,
  Image,
  Avatar,
  ImageSize,
  TextTitle,
  PaddingX,
  Width,
  TextColor,
  FontWeight,
  HoverColor,
  Padding,
  IconSize,
  ClickButton,
  User,
}) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(action.logout({ token: token }));
    dispatch(action.getCart());
    navigate(path.HOME);
  };

  return (
    <div
      className={`${PaddingX ? PaddingX : "px-2"} ${FontWeight ? FontWeight : "font-normal"} ${
        Width ? Width : "w-auto"
      } ${HoverColor ? HoverColor : "hover:bg-gray-200"} ${Padding ? Padding : "p-2"} group rounded-md`}
    >
      <button
        type={TypeButton || "button"}
        className={` ${TextColor ? TextColor : "text-gray-800"} relative flex items-center justify-center gap-1`}
        onClick={ClickButton}
      >
        {IconBefore && (
          <>
            <span className="flex h-8 w-8 items-center justify-center">
              <IconBefore size={IconSize || "24"} />
            </span>
            <span className="text-left">{TextTitle}</span>
          </>
        )}
        {Image && (
          <>
            <img
              src={Image}
              alt={TextTitle}
              className={`${ImageSize ? `w${ImageSize}` : "w-8"} ${ImageSize ? `h-${ImageSize}` : "h-8"} rounded-full object-contain`}
            />
            <span className="text-left">{TextTitle}</span>
          </>
        )}
        {Avatar && (
          <>
            <img
              src={Avatar ? Avatar : defaultAvatar}
              alt={TextTitle}
              className={`${ImageSize ? `w-${ImageSize}` : "w-8"} ${ImageSize ? `h-${ImageSize}` : "h-8"} rounded-full border border-black bg-white object-cover`}
            />
            {User?.roles.some((role) => role.name === "ADMIN") ? (
              <>
                <div className="absolute -right-2 top-8 z-50 hidden w-48 rounded-md bg-white text-left shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <Link to={path.HOME + path.ACCOUNT} state={{ User }}>
                      <p className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Thông tin tài khoản
                      </p>
                    </Link>
                    <Link to={path.HOME + path.ORDER_HISTORY}>
                      <p className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Đơn hàng của tôi
                      </p>
                    </Link>
                    <Link to={path.HOME}>
                      <p className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Trang chủ
                      </p>
                    </Link>
                    <Link to={path.ADMIN_HOME}>
                      <p className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Trang quản lý
                      </p>
                    </Link>
                    <div onClick={handleLogout}>
                      <p className="block cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Đăng xuất</p>
                    </div>
                  </div>
                </div>
                <span className="text-left">{formatLengthName(TextTitle)}</span>
              </>
            ) : (
              <>
                <div className="absolute -left-2 top-8 z-50 hidden w-48 rounded-md bg-white text-left shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <Link to={path.HOME + path.ACCOUNT} state={{ User }}>
                      <p className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Thông tin tài khoản
                      </p>
                    </Link>
                    <Link to={path.HOME + path.ORDER_HISTORY}>
                      <p className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Đơn hàng của tôi
                      </p>
                    </Link>
                    {User?.roles.some((role) => role.name === "ADMIN") && (
                      <Link to={path.ADMIN_HOME}>
                        <p className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Trang quản lý
                        </p>
                      </Link>
                    )}
                    <div onClick={handleLogout}>
                      <p className="block cursor-pointer px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Đăng xuất</p>
                    </div>
                  </div>
                </div>
                <span className="text-left">{formatLengthName(TextTitle)}</span>
              </>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default memo(ButtonCustom);
