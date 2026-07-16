import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/dashboard/Navbar";
import SideMenu from "../components/dashboard/SideMenu";

const DashboardLayout = ({ children , activeMenu}) => {
    const {user} = useUser();
  return (
    <div> 
        {/* navbar */}
        <Navbar  activeMenu={activeMenu} />
        {user && (
            <div className="flex">
                <div className="max-[1080px]:hidden">
                         {/* Side menu */}
                         <SideMenu activeMenu={activeMenu}/>
                </div>
                <div className="grow mx-5">{children}</div>
            </div>
        )}
    </div>
    )
}
export default DashboardLayout;