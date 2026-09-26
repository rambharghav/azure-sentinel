import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from './ToastContainer';
import { useAppState } from '../hooks/useAppState';

export default function Layout() {
  const { state } = useAppState();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-[240px] min-h-screen">
        <Outlet />
      </main>
      <ToastContainer notifications={state.notifications} />
    </div>
  );
}
