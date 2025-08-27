import CustomHeading from "../helpers/CustomHeading";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const TeacherProfileTop = ({ playlists, profile, approvedCoursesCount }) => {

    return (
        <>
            <CustomHeading text="profile details" />
            <div className="teacher-profile-top">
                <div className="user-info text-center">
                    <img src={
                        profile?.profilePhoto?.url}
                        className='img-fluid'
                        alt="teacher" />
                    <h5
                        className="mb-0 text-capitalize"
                        style={{
                            color: "var(--black)",
                            fontSize: "2rem"
                        }}>{profile?.username}</h5>
                    <span
                        style={{
                            color: "var(--light-color)",
                            fontSize: "1.7rem"
                        }}>{profile?.role}</span>
                </div>
                <ul>
                    <li>total playlists : <span>{playlists.length || 0}</span></li>
                    <li>total videos : <span>{approvedCoursesCount || 0}</span></li>
                    <li>total likes :  <span>1208</span></li>
                    <li>total comments : <span>52</span></li>
                </ul>
            </div>
        </>
    )
}

export default TeacherProfileTop;