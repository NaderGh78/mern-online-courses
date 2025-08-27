import './about.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProfiles } from '../../redux/apiCalls/profileApiCall';
import { useTitle } from '../../components/helpers/useTitle';
import { AboutTop, AboutMiddle, AboutBottom } from '../../allPagesPaths';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const About = () => {

    // get the page title
    useTitle(`About`);

    const dispatch = useDispatch();

    const { profiles } = useSelector(state => state.profile);

    /*=========================================*/

    // get all profiles
    useEffect(() => {
        dispatch(getAllProfiles());
    }, []);

    /*=========================================*/

    return (
        <div className='about custom-div'>
            <div className="container p-0">
                <AboutTop />
                <AboutMiddle />
                <AboutBottom profiles={profiles} />
            </div>
        </div>
    )
}

export default About;