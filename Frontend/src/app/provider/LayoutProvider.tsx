import { Outlet } from "react-router-dom";

const LayoutProvider = () => {
  return (
    <div className="flex justify-center min-h-screen ">
      <div className="w-full max-w-sm min-h-screen overflow-y-auto ">
        <Outlet />
      </div>
    </div>
  )
}

export default LayoutProvider;