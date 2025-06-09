import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoleList from './components/RoleList';
import ChatPage from './components/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleList />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
