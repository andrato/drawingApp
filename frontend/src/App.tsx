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
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            </Routes>
          </Router>
        </Box>
    </QueryClientProvider>
  );
}

export default App;
