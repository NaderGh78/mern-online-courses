import './home.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlaylists } from '../../redux/apiCalls/playListApiCall';
import { OurCourses, Quick } from '../../allPagesPaths';
import { useTitle } from '../../components/helpers/useTitle';
import Spinner from '../../components/common/spinner/Spinner';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const Home = () => {

    // get the page title
    useTitle(`Online Courses`);

    const dispatch = useDispatch();

    const { playLists, playlistLoading } = useSelector(state => state.playlists);

    const { currentUser } = useSelector(state => state.auth);

    // hide the become a tutor from ui in case the user already login and this user role is [teacher or admin]
    const hideBecomeTutor = currentUser && (currentUser?.isAdmin || currentUser?.role === "Teacher") ? false : true;

    /*=========================================*/

    useEffect(() => {

        dispatch(getAllPlaylists());

    }, [dispatch]);

    /*=========================================*/

    // send just the approved palylists 
    const justShowApprovedPlaylists = playLists.length > 0 && playLists?.filter(p => p.isPlaylistApproved === "approved");

    /*=========================================*/

    if (playlistLoading) return <Spinner />;

    return (
        <div className='home custom-div'>
            <div className="container p-0">
                <Quick hideBecomeTutor={hideBecomeTutor} />
                <OurCourses playLists={justShowApprovedPlaylists} />
            </div>
        </div>
    )
}

export default Home;