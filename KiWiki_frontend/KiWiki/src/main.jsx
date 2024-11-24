import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage from './HomePage/Components/HomePage.jsx';
import EntryTest from './Entry/EntryTest.jsx';
import Wiki from './Wiki/Wiki.jsx';
createRoot(document.getElementById('root')).render(

  <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/entryTest" element={<EntryTest/>} />
        {/* <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> {/* Ruta para 404 */}
        <Route path='/wikis/:selectedOpition/:query' element={<Wiki/>}></Route>
      </Routes>
    </Router>
)
