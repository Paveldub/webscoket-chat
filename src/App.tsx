import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";

import { Nav } from './Nav/Nav'
import { withSuspense } from './helpers/withSuspense'

const ChatPageComponent = React.lazy(() => import('./Pages/Chat'));
const SuspendedChatPage = withSuspense(ChatPageComponent)

function App() {

  return (
    <>
      <Nav />
      <Routes>
          <Route path="/chat" element={<SuspendedChatPage />} />
      </Routes>
    </>   
  );
}

export default App;
