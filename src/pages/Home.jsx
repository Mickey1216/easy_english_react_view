import { Layout } from 'antd';
import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import MainMenu from "../components/MainMenu";
const { Content, Footer, Sider } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左边侧边栏 */}
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="title" style={{color: 'pink', textAlign: 'center', fontSize: "26px", border:"2px solid pink", borderRadius: "5px"}}>单词轻松记</div>
        <MainMenu></MainMenu>
      </Sider>
      {/* 右边内容 */}
      <Layout>
        {/* 右边内容部分-白色底盒子 */}
        <Content>
          {/* 窗口部分 */}
          <Outlet />
        </Content>
        {/* 右边底部 */}
        <Footer style={{ textAlign: 'center', padding: 0, lineHeight:"48px" }}>©2023 版权归Mickey所有</Footer>
      </Layout>
    </Layout>
  );
};

export default Home;