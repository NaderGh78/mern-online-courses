import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    MyFooter,
    ScrollToTopWhenNavigatePage,
    SideBar,
    SideBarOnSmallDevices,
    TopHeader
} from "../allPagesPaths";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Layout = () => {

    const { sideBarToggle } = useSelector(state => state.sidebar);

    /*=========================================*/

    return (
        <>
            <div className="main-layout">

                {/* this the main side bar that on big screen devices */}
                <SideBar sideBarToggle={sideBarToggle} />

                {/* this will show the side bar min in small devices ,by hidden the main side bar*/}
                <SideBarOnSmallDevices sideBarToggle={sideBarToggle} />

                <div className={sideBarToggle ? "main-content full-screen" : "main-content"}>
                    <TopHeader />
                    <div className="content-area">
                        <Outlet />
                        <MyFooter sideBarToggle={sideBarToggle} />
                    </div>
                </div>

                {/* scrol to top when navigate pages */}
                <ScrollToTopWhenNavigatePage />

            </div>
        </>
    )
}

export default Layout;