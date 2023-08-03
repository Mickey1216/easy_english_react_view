import {
  HighlightOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

// 登录请求到数据之后，就可以跟items这个数组进行匹配
const items = [
  {
    label: "我的单词",
    key: "/mywords",
    icon: <FileTextOutlined />,
  },
  {
    label: "单词复习",
    key: "/wordsreview",
    icon: <HighlightOutlined />,
  },
  {
    label: "设置",
    key: "/settings",
    icon: <SettingOutlined />,
  },
  {
    label: "登出",
    key: "/logout",
    icon: <UserOutlined />,
  },
];

const MainMenu = () => {
  const navigateTo = useNavigate();
  const currentRoute = useLocation();

  const menuClick = (e) => {
    // 点击跳转到对应的路由 编程式导航跳转，利用到一个hook
    navigateTo(e.key);

    if(e.key === '/logout') {
      Cookies.remove('easy-english-react-token');
      message.success('登出成功');
      navigateTo('/login');
    }
  };

  return (
    <Menu
      theme="dark"
      // defaultSelectedKeys表示当前样式所在的选中项的key
      defaultSelectedKeys={[currentRoute.pathname]}
      mode="inline"
      // 菜单项的数据
      items={items}
      onClick={menuClick}
      style={{marginTop: 20}}
    />
  );
};

export default MainMenu;
