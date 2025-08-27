import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import VideoCard from "./VideoCard";
import CustomHeading from "../helpers/CustomHeading";

/*=========================================*/
/*=========================================*/
/*=========================================*/

const PlaylistVideos = ({ allCourses, playlistId }) => {

  const location = useLocation();

  /*=========================================*/

  // scroll to top playlist videos section , when teacher need to see the courses in this page
  useEffect(() => {

    const searchParams = new URLSearchParams(location.search);

    const scrollTo = searchParams.get("scrollTo");

    if (scrollTo === "courses-section") {

      setTimeout(() => {

        const coursesSection = document.getElementById("courses-section");

        if (coursesSection) {

          // Calculate the scroll target,Adjusted offset (140) + CustomHeading height (84) + footer height (60)
          const scrollTarget = coursesSection.offsetTop - 284; // 

          // Force scroll to the target position
          window.scrollTo({
            top: scrollTarget,
            behavior: "auto",
          });

          // Double-check the scroll position after a short delay
          setTimeout(() => {
            // console.log("Current Scroll Position (After):", window.pageYOffset);
          }, 200); // 200ms delay

        }

      }, 100); // 100ms delay

    }

  }, [location.search]);

  /*=========================================*/

  return (
    <>
      <CustomHeading text="playlist videos" />
      <div className="playlist-videos" id="courses-section">
        <div className="container p-0">
          <div className="row">
            {
              allCourses.length > 0
                ?
                allCourses?.map(course => (
                  <div className="col-xxl-4 col-lg-4 col-md-6" key={course._id}>
                    <VideoCard data={course} playlistId={playlistId} />
                  </div>
                ))
                :
                <h1 style={{ color: "var(--light-color)" }}>No courses yet in this playlist</h1>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default PlaylistVideos;