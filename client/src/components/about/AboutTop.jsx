import { Link } from "react-router-dom";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AboutTop = () => {
    return (
        <div className="about-top">
            <div className="row align-items-center">
                <div className="col-lg-5 col-md-6">
                    <div className="thumb">
                        <img
                            src={process.env.PUBLIC_URL + `/assets/images/about-img.svg`}
                            alt="about avatar"
                            className="img-fluid"
                        />
                    </div>
                </div>
                <div className="col-lg-7 col-md-6">
                    <h3>why choose us?</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                        Ut dolorum quasi illo? Distinctio expedita commodi, nemo
                        a quam error repellendus sint, fugiat quis numquam eum
                        eveniet sequi aspernatur quaerat tenetur.
                    </p>
                    <Link to={"/courses"} className="custom-link">Our Courses</Link>
                </div>
            </div>
        </div>
    )
}

export default AboutTop;