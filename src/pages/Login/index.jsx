import { useState, useRef, useEffect } from "react";
import { Input, Alert, message } from "antd";
import { UserOutlined, KeyOutlined, MailOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { loginAPI, registerAPI, createConfigAPI } from "../../api/api";

const Login = () => {
  const navigate = useNavigate(); // 路由跳转
  const loginUsernameInputRef = useRef(null); // 用户登录用户名输入框
  const [loginActive, setLoginActive] = useState(true); // 默认为登录
  const [loginForm, setLoginForm] = useState({
    // 登录表单
    userName: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    // 注册表单
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginPrompt, setLoginPrompt] = useState({
    // 登录提示
    type: "success",
    message: "单词轻松记-开心每一天",
  });
  const [registerPrompt, setRegisterPrompt] = useState({
    // 注册提示
    type: "warning",
    message: "填写正确的邮箱",
  });

  // 登录-标题
  const loginActiveClicked = () => {
    setLoginActive(true);
    setLoginForm({
      userName: "",
      password: "",
    });
  };

  // 注册-标题
  const registerActiveClicked = () => {
    setLoginActive(false);
  };

  // 登录按钮回调
  const loginBtnClicked = () => {
    let userName = loginForm.userName.trim();
    let password = loginForm.password.trim();

    if (userName.length < 2 || userName.length > 15 || !password.length) {
      setLoginPrompt({
        type: "error",
        message: "账号或密码有误！",
      });
      return;
    }

    // 调用用户登录接口
    loginAPI({ userName, password }).then((res) => {
      if (res.res.code === 200) {
        message.success("登录成功！", 0.5, () => {
          // 清空登录表单
          setLoginForm({
            userName: "",
            password: "",
          });
          // 将用户信息存入cookie
          Cookies.set("userName", res.result.userName, { expires: 14 });
          Cookies.set("easy-english-react-token", res.access_token, {
            expires: 14,
          });
          // 路由跳转
          navigate("/mywords");
        });
      } else if (res.res.code === 1002) {
        message.error("密码错误！", 1);
      }
    });
  };

  // 注册按钮回调
  const registerBtnClicked = () => {
    let userName = registerForm.userName.trim();
    let email = registerForm.email.trim();
    let password = registerForm.password.trim();
    let confirmPassword = registerForm.confirmPassword.trim();
    // 验证邮箱的正则表达式
    let emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

    if (userName === "") {
      setRegisterPrompt({
        type: "error",
        message: "用户名怎么都不输入？",
      });
      return;
    } else if (!emailReg.test(email)) {
      setRegisterPrompt({
        type: "error",
        message: "请输入正确的邮箱地址！",
      });
      return;
    } else if (password === "") {
      setRegisterPrompt({
        type: "error",
        message: "密码怎么都不输入？",
      });
      return;
    } else if (password !== confirmPassword) {
      setRegisterPrompt({
        type: "error",
        message: "两次密码不一致！",
      });
      return;
    } else if (userName.length < 2 || userName.length > 15) {
      setRegisterPrompt({
        type: "error",
        message: "用户名至少有2位，且不能超过15位！",
      });
      return;
    }

    // 调用用户注册接口
    registerAPI({ userName, email, password, confirmPassword }).then((res) => {
      if (res.code === 200) {
        message.success("注册成功，可以去登录啦！", 1.5, () => {
          // 清空注册表单
          setRegisterForm({
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setLoginActive(true);
          setLoginForm({
            userName: "",
            password: "",
          });
        });

        // TODO
        // 将用户名添加进入用户配置表
        createConfigAPI({ userName }).then((res) => {
          console.log(res);
        });
      } else if (res.code === 1001) {
        message.error("用户已存在！", 1);
      } else {
        message.error("服务器出现问题啦！", 1);
      }
    });
  };

  // 登录时，用户名输入框自动聚焦
  useEffect(() => {
    loginUsernameInputRef.current.focus();
  }, []);

  return (
    <>
      <div className="login-ct">
        <div className="ct">
          {/* 登录|注册 - 标题 */}
          <div className="opt">
            <div
              onClick={loginActiveClicked}
              className={`optItem active ${
                loginActive ? "active" : "inactive"
              }`}
            >
              登&nbsp;录
            </div>
            <div
              onClick={registerActiveClicked}
              className={`optItem ${loginActive ? "inactive" : "active"}`}
            >
              注&nbsp;册
            </div>
          </div>

          {/* 登录|注册 - 内容 */}
          <>
            {loginActive ? (
              <div className="inputsLogin">
                <div className="inputsRow">
                  <span className="inputsRowIcon">
                    <UserOutlined />
                  </span>
                  <Input
                    type="text"
                    placeholder="请输入用户名"
                    value={loginForm.userName}
                    ref={loginUsernameInputRef}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, userName: e.target.value })
                    }
                  ></Input>
                </div>
                <div className="inputsRow">
                  <span className="inputsRowIcon">
                    <KeyOutlined />
                  </span>
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                  ></Input>
                </div>
                <div className="inputsBtn" onClick={loginBtnClicked}>
                  登录
                </div>
              </div>
            ) : (
              <div className="inputsRegister">
                <div className="inputsRow">
                  <span className="inputsRowIcon">
                    <UserOutlined />
                  </span>
                  <Input
                    type="text"
                    placeholder="请输入用户名"
                    value={registerForm.userName}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        userName: e.target.value,
                      })
                    }
                  ></Input>
                </div>
                <div className="inputsRow">
                  <span className="inputsRowIcon">
                    <MailOutlined />
                  </span>
                  <Input
                    type="email"
                    placeholder="请输入邮箱"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                  ></Input>
                </div>
                <div className="inputsRow">
                  <span className="inputsRowIcon">
                    <KeyOutlined />
                  </span>
                  <Input
                    type="password"
                    placeholder="请输入密码"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                  ></Input>
                </div>
                <div className="inputsRow">
                  <span className="inputsRowIcon">
                    <KeyOutlined />
                  </span>
                  <Input
                    type="password"
                    placeholder="请再次输入密码"
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                  ></Input>
                </div>
                <div className="inputsBtn" onClick={registerBtnClicked}>
                  注册
                </div>
              </div>
            )}
          </>

          <div className="prompt">
            <Alert
              message={`${
                loginActive ? loginPrompt.message : registerPrompt.message
              }`}
              type={`${loginActive ? loginPrompt.type : registerPrompt.type}`}
            />
          </div>
        </div>
      </div>
      <div id="footer">
        <div>©2023&nbsp;&nbsp;版权归Mickey所有</div>
      </div>
    </>
  );
};

export default Login;
