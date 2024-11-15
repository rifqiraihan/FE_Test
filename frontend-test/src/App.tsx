import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DrawerMenu from './components/drawer/DrawerMenu';
import Header from './components/header/Header';
import Dashboard from './pages/dashboard/Dashboard';
import LaporanPerhari from './pages/laporan-lalin/laporan-perhari/LaporanPerhari';
import Login from './pages/login/Login';
import MasterGerbang from './pages/master-gerbang/MasterGerbang';


const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
   <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <div className="flex flex-col relative">
              <Header onOpenDrawer={() => setDrawerOpen(true)} />
              <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
              <main className="flex-grow p-8 m-10 w-full md:w-3/4 mx-auto shadow-xl border-2 min-h-screen" style={{borderRadius:'12px'}}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/laporan/per-hari" element={<LaporanPerhari />} />
                  <Route path="/master" element={<MasterGerbang />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
