import './App.less';
import './style/global.less';

import { Outlet } from 'react-router-dom';

import { Os } from '@/lib';
import DebugTool from '@/lib/debugger/DebugTool';

function App() {
  return (
    <>
      <Outlet />
      {Os.debug && <DebugTool />}
    </>
  );
}

export default App;
