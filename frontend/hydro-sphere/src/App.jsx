import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import { Toaster } from "react-hot-toast";
import FloodTest from "./Components/FloodTest";
import Education from "./Components/SideBar/Education";
import News from "./Components/News";
import Contacts from "./Components/Contacts";
import ZoneReport from "./Components/ZoneReport";
import Pdf from "./Components/Pdf";
import Weather from "./Components/Weather";
import Home from "./Components/Home";
import Loader from "./Components/Loader";
import Transition from "./Components/Transition";
import ViewProfile from "./Components/ViewProfile";
import RiskZoning from "./Components/RiskZoning";
import CityPrediction from "./Components/CityPrediction";


 

const App = () => {
  const appRouter = createBrowserRouter([
    {
      element: <Transition />, 
      children: [
        { path: "/", element: <Home /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/flood", element: <FloodTest /> },
       
        
      ],
    },
     { path: "/education", element: <Education /> },
        { path: "/news", element: <News /> },
        { path: "/contacts", element: <Contacts /> },
        { path: "/report", element: <ZoneReport /> },
        { path: "/pdf", element: <Pdf /> },
        { path: "/weather", element: <Weather /> },
        {
          path : "/zoning" , element : <RiskZoning/>
        },
        {path : "/prediction" , element : <CityPrediction/>}

  ]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;
