import { Link } from "react-router-dom";
import { LiaPlaySolid } from "react-icons/lia";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const VideoCard = ({ data: { _id, videoTitle, tutorialImage }, playlistId }) => {

    return (
        <Link to={`/watch-video/${playlistId}/${_id}`}>
            <div className="video-card">
                <div className="thumb">
                    <img src={tutorialImage?.url}
                        className='img-fluid'
                        alt="video thumb" />
                    <div className="overlay-thumb">
                        <LiaPlaySolid />
                    </div>
                </div>
                <h6 style={{ fontSize: "1.8rem" }}>{videoTitle}</h6>
            </div>
        </Link>
    )
}

export default VideoCard;