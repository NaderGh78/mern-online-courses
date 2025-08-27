import { createBrowserRouter, createHashRouter } from "react-router-dom";
import {
    About,
    AddNewCourse,
    AddNewPlayList,
    Admin,
    AdminCoursesTable,
    AdminPlaylistsTable,
    CategoryTable,
    ContactUs,
    Courses,
    CourseSearch,
    CoursesTable,
    CourseView,
    EditCourse,
    EditPlayList,
    Home,
    Layout,
    Login,
    MainTeacherTable,
    NotFound,
    OtherTable,
    PlaylistDetails,
    PlaylistView,
    Profile,
    ProtectedRoute,
    Register,
    StudentsTable,
    TeacherDashboard,
    TeacherProfile,
    Teachers,
    TeachersTable,
    UpdateUserProfile,
    UserSavedPlaylists,
    WatchingVideo
} from "../allPagesPaths";

/*===========================================*/
/*===========================================*/
/*===========================================*/

export const router = createHashRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            // Public routes (no protection needed)
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/courses",
                element: <Courses />
            },
            {
                path: "/teachers",
                element: <Teachers />
            },
            {
                path: "/contact",
                element: <ContactUs />
            },
            {
                path: "/playlist-details/:id",
                element: <PlaylistDetails />
            },
            {
                path: "/teacher-profile/:id",
                element: <TeacherProfile />
            },
            {
                path: "/course-search",
                element: <CourseSearch />
            },

            // Auth routes (ONLY for logged-OUT users)
            {
                path: "/register",
                element: (
                    <ProtectedRoute requireAuth={false}>
                        <Register />
                    </ProtectedRoute>
                )
            },
            {
                path: "/login",
                element: (
                    <ProtectedRoute requireAuth={false}>
                        <Login />
                    </ProtectedRoute>
                )
            },

            // Private routes (ONLY for logged-IN users)
            {
                path: "/profile/:id",
                element: (
                    <ProtectedRoute requireAuth={true}>
                        <Profile />
                    </ProtectedRoute>
                )
            },
            {
                path: "/update-user/:id",
                element: (
                    <ProtectedRoute requireAuth={true}>
                        <UpdateUserProfile />
                    </ProtectedRoute>
                )
            },
            {
                path: "/watch-video/:playlistId/:courseId",
                element: (
                    <ProtectedRoute requireAuth={true}>
                        <WatchingVideo />
                    </ProtectedRoute>
                )
            },
            {
                path: "/user-saved-playlist/:id",
                element: (
                    <ProtectedRoute requireAuth={true}>
                        <UserSavedPlaylists />
                    </ProtectedRoute>
                )
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute requireAuth={true} adminOnly={true}>
                        <Admin />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <AdminPlaylistsTable />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "courses-admin",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <AdminCoursesTable />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "teachers",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <TeachersTable />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "students",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <StudentsTable />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "other",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <OtherTable />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "playlist-view/:playlistId",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <PlaylistView />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "course-view/:playlistId/:courseId",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <CourseView />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "category",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <CategoryTable />
                            </ProtectedRoute>
                        )
                    }
                ]
            },
            {
                path: "/teacher-dashboard",
                element: <TeacherDashboard />
                ,
                children: [
                    {
                        index: true,
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <MainTeacherTable />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "add-playlist",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <AddNewPlayList />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "add-course",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <AddNewCourse />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "table-course",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <CoursesTable />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "edit-playlist/:id",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <EditPlayList />
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "edit-course/:playlistId/:courseId",
                        element: (
                            <ProtectedRoute requireAuth={true}>
                                <EditCourse />
                            </ProtectedRoute>
                        )
                    }
                ]
            }
        ]
    },
    { path: "*", element: <NotFound /> }

]);