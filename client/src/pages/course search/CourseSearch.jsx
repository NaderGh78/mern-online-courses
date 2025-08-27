import "./course-search.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { searchForPlaylist } from "../../redux/apiCalls/playListApiCall";
import { useSearchParams } from "react-router-dom";
import { CourseCard } from "../../allPagesPaths";
import CustomHeading from '../../components/helpers/CustomHeading';
import { useTitle } from "../../components/helpers/useTitle";
import Spinner from "../../components/common/spinner/Spinner";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const CourseSearch = () => {

    // get the page title
    useTitle(`Course Search`);

    /*=========================================*/

    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();

    const query = searchParams.get('q') || '';

    const { searchPlaylist, playlistLoading } = useSelector(state => state.playlists);

    /*=========================================*/

    useEffect(() => {

        if (query.trim()) {

            dispatch(searchForPlaylist(query));
        }

    }, [query]);

    /*=========================================*/

    return (
        <div className='course-search custom-div'>
            <div className="container p-0">
                {playlistLoading ?
                    (<Spinner />)
                    : searchPlaylist && searchPlaylist.length > 0 ? (
                        <>
                            <CustomHeading text={`Search Results for ${query}`} />
                            <div className="row">
                                {searchPlaylist.map(p => (
                                    <div className="col-lg-4 col-sm-6" key={p._id}>
                                        <CourseCard data={{ ...p, coursesCount: p.approvedCoursesCount }} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) :
                        (<h2 style={{ color: "var(--light-color)" }}>No playlist found.</h2>)
                }
            </div>
        </div>
    );
}

export default CourseSearch;