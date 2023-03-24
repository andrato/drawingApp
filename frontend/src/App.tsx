import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Box } from "@mui/material";

import { Navbar } from './components/header/Navbar';
import { TopArt } from './components/topArt/TopArt';
import { TopAmateur } from './components/topAmateur/TopAmateur';
import { Gallery } from './components/gallery/Gallery';
import { Users } from './components/users/Users';
import { Draw } from "./components/draw/Draw";
import { SignIn } from "./components/user/SignIn";
import { SignUp } from "./components/user/SignUp";

function App() {
  return (
    <Box sx={{
      height: "100vh",
      width: "100vw",
    }}>
      <Router>
        <Navbar />
        <Routes>
            <Route path='/' element={<TopArt/>} />
            <Route path='/topart' element={<TopArt />} />
            <Route path='/topamateur' element={<TopAmateur/>} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/users' element={<Users />} />
            <Route path='/draw' element={<Draw />} />
            {/* <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} /> */}
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
