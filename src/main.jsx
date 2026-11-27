import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css'
import App from './App.jsx'
import Test from './pages/Test.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "test",
    children: [
      { index: true, element: <Test /> },
      { path: "asdasd", element: <h1>Paasdge Not Found</h1> }
    ]
  },
  {
    path: "*",
    element: <h1>Page Not Found<p><br/>halo</p></h1>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
