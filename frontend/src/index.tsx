import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
// import {CanvasContainer} from './components/canvas/CanvasContainer';
// import { Navbar } from './components/header/Navbar';
// import { TopArt } from './components/topArt/TopArt';
// import { TopAmateur } from './components/topAmateur/TopAmateur';
// import { Gallery } from './components/gallery/Gallery';
// import { Users } from './components/users/Users';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App/>
//   },
//   {
//     path: "/topart",
//     element: <TopArt/>
//   },
//   {
//     path: "/topamateur",
//     element: <TopAmateur/>
//   },
//   {
//     path: "/gallery",
//     element: <Gallery/>
//   },
//   {
//     path: "/users",
//     element: <Users/>
//   },
//   {
//     path: "/draw",
//     element: <CanvasContainer/>
//   }
// ]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App/>
    {/* <RouterProvider router={router} /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
