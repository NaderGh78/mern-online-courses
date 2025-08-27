import { Link } from 'react-router-dom';
import { CourseCard } from '../../allPagesPaths';
import CustomHeading from '../helpers/CustomHeading';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const OurCourses = ({ playLists }) => {

    const perPageCourses = 3;

    /*=========================================*/

    return (
        <>
            <CustomHeading text="our courses" />
            <div className="our-courses">
                <div className="container p-0">
                    <div className="row">
                        {playLists?.length > 0 ? (
                            playLists
                                .slice(0, perPageCourses)
                                .map(card => (
                                    <div className="col-12 col-sm-6 col-lg-4" key={card._id}>
                                        <CourseCard
                                            data={{
                                                ...card,
                                                coursesCount: card.approvedCoursesCount
                                            }}
                                        />
                                    </div>
                                ))
                        ) : (
                            <h2 style={{ color: "var(--light-color)" }}>No Courses yet</h2>
                        )}
                    </div>
                </div>

                {playLists?.length > 0 && (
                    <div className="w-100 text-center mt-5">
                        <Link to={"/courses"} className="view-all">
                            View All Courses
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default OurCourses;