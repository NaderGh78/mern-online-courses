import { Link } from "react-router-dom";
import { homeCategorieData, homePopularData } from "../helpers/sectionData";
import CustomHeading from "../helpers/CustomHeading";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Quick = ({ hideBecomeTutor }) => {

    return (
        <>
            <CustomHeading text="quick options" />
            <div className="intro-boxes">
                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className='box'>
                            <h5>likes and comments</h5>
                            <ul>
                                <li>
                                    total likes : <span>25</span>
                                    <Link to={"/about"} className='main-custom-link'>view likes</Link>
                                </li>
                                <li>
                                    total comments : <span>12</span>
                                    <Link to={"/about"} className='main-custom-link'>view comments</Link>
                                </li>
                                <li>
                                    saved playlists : <span>4</span>
                                    <Link to={"/about"} className='main-custom-link'>view playlists</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className='box'>
                            <h5>top categories</h5>
                            <ul className='others'>
                                {
                                    homeCategorieData?.map(li => (
                                        <li key={li.id}><Link>{li.icon} {li.text}</Link></li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className='box'>
                            <h5>popular topics</h5>
                            <ul className='others'>
                                {
                                    homePopularData?.map(li => (
                                        <li key={li.id}><Link>{li.icon} {li.text}</Link></li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    {
                        // hide the become a tutor from ui in case the user already login and this user role is [teacher or admin]
                        hideBecomeTutor ?
                            <>
                                <div className="col-lg-4 col-md-6">
                                    <div className='box'>
                                        <h5>become a tutor</h5>
                                        <p style={{ color: "var(--light-color)", fontSize: "1.2rem" }}>
                                            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                                            Perspiciatis, nam?
                                        </p>
                                        <Link to={"/teachers"} className='main-custom-link'>Get Started</Link>
                                    </div>
                                </div>
                            </>
                            :
                            null
                    }
                </div>
            </div>
        </>
    )
}

export default Quick;