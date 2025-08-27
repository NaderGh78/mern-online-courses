import CustomHeading from "../helpers/CustomHeading";
import { CourseCard } from '../../allPagesPaths';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const TeacherProfileBttom = ({ playlists }) => {

  return (
    <>
      <CustomHeading text="our courses" />
      <div className="teacher-profile-bottom">
        <div className="row">
          {
            playlists?.length > 0
              ?
              playlists?.map(card => (
                <div className="col-lg-4 col-sm-6" key={card._id}>
                  <CourseCard data={card} />
                </div>
              ))
              :
              <h1>No courses for this teacher</h1>
          }
        </div>
      </div>
    </>
  )
}

export default TeacherProfileBttom;