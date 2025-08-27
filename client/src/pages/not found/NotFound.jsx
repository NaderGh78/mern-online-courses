import './not-found.css';
import { Link } from 'react-router-dom';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const NotFound = () => {
  return (
    <div className="not-found">
      <img src={process.env.PUBLIC_URL + `/assets/images/not-found.png`} alt="not found" />
      <div className='text-center'>
        <h4>Page Not Found</h4>
        <p className='text-capitalize'>we couldn't find what you were looking for.</p>
      </div>
      <p><Link to="/">Go To Home Page.</Link> </p>
    </div>
  )
}

export default NotFound;