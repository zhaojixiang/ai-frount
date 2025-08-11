import { Outlet } from 'react-router-dom';

import DebugTool from '@/lib/debugger/DebugTool';

import './App.less';

function App() {
  return (
    <>
      <Outlet />
      {JOJO.Os.debug && <DebugTool />}
    </>
  );
}

export default App;
