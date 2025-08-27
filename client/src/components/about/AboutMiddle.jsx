import { aboutMiddleData } from "../helpers/sectionData";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const AboutMiddle = () => {
    return (
        <div className="about-middle">
            <div className="row">
                {
                    aboutMiddleData?.map(el => (
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={el.id}>
                            <div>
                                {el.icon}
                                <div>
                                    <h5>{el.number}</h5>
                                    <p>{el.text}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AboutMiddle;