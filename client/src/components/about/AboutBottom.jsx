import { Link } from "react-router-dom";
import CustomHeading from "../helpers/CustomHeading";
import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AboutBottom = ({ profiles }) => {

    return (
        <div className="about-bottom">
            <CustomHeading text="student's reviews" />
            <div className="row">
                {
                    profiles?.map(el => (
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12" key={el._id}>
                            <div className="students-box">
                                <p>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                                    Necessitatibus, suscipit a. Quibusdam, dignissimos consectetur.
                                    Sed ullam iusto eveniet qui aut quibusdam vero voluptate libero
                                    facilis fuga. Eligendi eaque molestiae modi?
                                </p>
                                <div className="student-info">
                                    <img
                                        src={el.profilePhoto?.url}
                                        alt="student avatar"
                                    />
                                    <div>
                                        <h5>
                                            {
                                                el?.role === "Teacher"
                                                    ?
                                                    <Link to={`/teacher-profile/${el._id}`}>{el.username}</Link>
                                                    :
                                                    <Link to={`/profile/${el._id}`}>{el.username}</Link>
                                            }
                                        </h5>
                                        <ul>
                                            {/* {
                                                [...Array(el.rating)].map((_, index) => (
                                                    <li key={index}><FaStar /></li>
                                                ))
                                            } */}
                                            <li><FaStar /></li>
                                            <li><FaStar /></li>
                                            <li><FaStar /></li>
                                            <li><FaStar /></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AboutBottom;