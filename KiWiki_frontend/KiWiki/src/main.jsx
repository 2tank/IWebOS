import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import HomePage from './HomePage/Components/HomePage.jsx';
import EntrySection from './Entry/EntrySection.jsx';
import Wiki from './Wiki/Wiki.jsx';
import EntryTest from './Entry/EntryTest.jsx';
import NotificationPage from './Notifications/NotificationPage.jsx';
import NotificationProvider from './Common/NotificationContext.jsx';
createRoot(document.getElementById('root')).render(
  <NotificationProvider>
  <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/entry" element={<EntrySection/>} />
        {/* <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> {/* Ruta para 404 */}
        <Route path='/wikis/:selectedOpition/:query' element={<Wiki/>}></Route>
        {/*<Route path='/entryTest' element={<EntryTest/>} /> DEJADME ESTO PORFA, voy a ensuciar esto para los comentarios y cuando esten listo los exporto a la entry*/}
        <Route path="/notifications" element={<NotificationPage/>} />
      </Routes>
    </Router>
    </NotificationProvider>
)
