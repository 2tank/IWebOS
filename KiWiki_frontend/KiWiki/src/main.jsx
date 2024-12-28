import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'

import { GoogleOAuthProvider } from "@react-oauth/google"

import HomePage from './HomePage/Components/HomePage.jsx';
import DetailedEntry from './Entry/DetailedEntry.jsx';
import Wiki from './Wiki/Wiki.jsx';
import ListEntries from './Entry/ListEntries.jsx';
import PostVersion from './Version/PostVersion.jsx';
import CreateWiki from './Wiki/CreateWiki.jsx';
import PostEntry from './Entry/PostEntry.jsx';
import NotificationProvider from './Common/NotificationContext.jsx';
import NotificationPage from './Notifications/NotificationPage.jsx'
import { SessionProvider } from './Common/SessionProvider.jsx';
import SetRolePage from './Common/SetRolePage.jsx';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='340827873659-snpqv9je3o790pgchph26jkl1csmmeju.apps.googleusercontent.com'>
    <SessionProvider>
      <NotificationProvider>
        <Router>
              <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/wikis/:nameWiki/entries/:nameEntry" element={<DetailedEntry/>} />
                <Route path="/wikis/:nameWiki/entries/:entry_id/versionedit" element={<PostVersion/>}/> 
                <Route path='/wikis/:nameWiki/entries' element={<ListEntries/>}></Route>
                <Route path='/wikis/:wiki_id/create' element={<PostEntry/>}></Route>
                <Route path='/wikis/:nameWiki/entries/:entry_id/modify' element={<PostEntry/>}></Route>
                <Route path='/wikis/:selectedOption/:query/:dateOption' element={<Wiki/>}></Route>
                <Route path='/wikis/:selectedOption/:query' element={<Wiki/>}></Route>
                <Route path='/wikis/create' element={<CreateWiki/>}></Route>
                <Route path='/wikis/:nameWiki/modify' element={<CreateWiki/>}></Route>
                <Route path="/notifications" element={<NotificationPage/>} />
                <Route path="/setRole" element={<SetRolePage/>} />
                {/* <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} /> {/* Ruta para 404 */}
              </Routes>
        </Router>
      </NotificationProvider>
    </SessionProvider>
  </GoogleOAuthProvider>
)