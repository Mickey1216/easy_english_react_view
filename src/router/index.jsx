import { Navigate } from "react-router-dom";
import React, { lazy } from "react";

import Home from "../pages/Home";
import Login from '../pages/Login';

const MyWords = lazy(() => import("../pages/MyWords"));
const WordsReview = lazy(() => import("../pages/WordsReview"));
const Settings = lazy(() => import("../pages/Settings"));

const withLoadingComponent = (comp) => (
  <React.Suspense fallback={<div>Loading</div>}>{comp}</React.Suspense>
);

const routes = [
  // 嵌套路由 开始
  {
    path: "/",
    element: <Navigate to="/mywords" />
  },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/mywords",
        element: withLoadingComponent(<MyWords />)
      },
      {
        path: "/wordsreview",
        element: withLoadingComponent(<WordsReview />)
      },
      {
        path: "/settings",
        element: withLoadingComponent(<Settings />)
      }
    ],
  },
  // 嵌套路由 结束
  {
    path:'/login',
    element: <Login />
  },
  // 访问其余路径的时候直接跳转到首页
  {
    path:'*',
    element: <Navigate to="/mywords" />
  }
  
];

export default routes;
