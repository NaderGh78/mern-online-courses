import './footer.css';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const MyFooter = ({ sideBarToggle }) => {
    return (
        <div className={sideBarToggle ? "footer full-screen" : "footer"}>
            &copy; copyright @ 2025 by
            <span style={{ color: "var(--main-color)", marginRight: ".1rem" }}> Nader Ghanawi | </span>
            all rights reserved!
        </div>
    )
}

export default MyFooter;