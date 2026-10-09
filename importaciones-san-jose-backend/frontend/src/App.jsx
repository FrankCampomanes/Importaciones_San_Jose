import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Rutas futuras:
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/sedes" element={<Sedes />} />
            <Route path="/nosotros" element={<Nosotros />} />
            */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
