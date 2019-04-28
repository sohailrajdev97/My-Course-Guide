/* Export each route component here that will be lazy loaded. This means the js file for that route
 * will not be loaded until the user navigates to that route. The exported values here are imported
 * in the Routes/index.jsx
 */
/* `loader` refers to the component that will be loaded while `loading` refers to a component to
 * display while the component is loading
 */

import React from "react";
import Loadable from "react-loadable";

export const Home = Loadable({
  loader: () => import("./Home.jsx"),
  loading: () => <div>Loading...</div>
});

export const Login = Loadable({
  loader: () => import("./Login.jsx"),
  loading: () => <div>Loading...</div>
});

export const Upload = Loadable({
  loader: () => import("../components/admin/Upload.jsx"),
  loading: () => <div>Loading...</div>
});

export const Course = Loadable({
  loader: () => import("../components/Course.jsx"),
  loading: () => <div>Loading...</div>
});

export const Activities = Loadable({
  loader: () => import("../components/Activities.jsx"),
  loading: () => <div>Loading...</div>
});

export const ErrorPage = Loadable({
  loader: () => import("./404/404.jsx"),
  loading: () => <div>Loading...</div>
});
