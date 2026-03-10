import { AppLayout } from "@/layouts";
import { ProfileMedia, ProfileMusic, ProfilePosts, ProfileReposts, ProfileSaved } from "@/components";
import { Account, AccountBirthdate, AccountDelete, AccountEmail, AccountGender, AccountLocation, AccountUsername, Appearance, Chats, Compose, CustomFeed, Favorites, FeedForm, Feeds, FeedsReorder, Following, ForYou, Home, Legal, LinkForm, Links, LinksReorder, Mutuals, NoFound, Notify, PagePost, PagePostActivity, PagePostActivityUsers, Profile, ProfileArchive, ProfileEdit, ProfileFollowers, ProfileFollowing, ProfileInfo, ProfileTrashCan, Search, SearchPosts, SearchUsers, Settings, SettingsAbout, SettingsPrivacyAndSecurity } from "@/pages";
import { Navigate, Outlet } from "react-router-dom";

export const privateRoutes = [
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "",
                element: <Home />,
                children: [
                    { path: "", element: <ForYou /> },
                    { path: "foryou", element: <ForYou /> },
                    { path: "following", element: <Following /> },
                    { path: "favorites", element: <Favorites /> },
                    { path: "mutuals", element: <Mutuals /> },
                    { path: "lists/:feedId", element: <CustomFeed /> },
                ]
            },
            { path: "lists", element: <Feeds /> },
            { path: "lists/reorder", element: <FeedsReorder /> },
            { path: "lists/new", element: <FeedForm /> },
            { path: "lists/:feedId/edit", element: <FeedForm /> },
            { path: "saved", element: <Navigate to="/" replace /> },
            { path: "search", element: <Search /> },
            { path: "search/profiles", element: <SearchUsers /> },
            { path: "search/posts", element: <SearchPosts /> },
            { path: "compose", element: <Compose /> },
            { path: "chats", element: <Chats /> },
            { path: "notify", element: <Notify /> },
            {
                path: ":username",
                children: [
                    {
                        element: <Profile />,
                        children: [
                            { index: true, element: <ProfilePosts /> },
                            { path: "media", element: <ProfileMedia /> },
                            { path: "reposts", element: <ProfileReposts /> },
                            { path: "music", element: <ProfileMusic /> },
                            { path: "saved", element: <ProfileSaved /> },
                        ]
                    },
                    { path: "edit", element: <ProfileEdit /> },
                    { path: "links", element: <Links /> },
                    { path: "links/new", element: <LinkForm /> },
                    { path: "links/:linkId/edit", element: <LinkForm /> },
                    { path: "links/reorder", element: <LinksReorder /> },
                    { path: "info", element: <ProfileInfo /> },
                    { path: "archive", element: <ProfileArchive /> },
                    { path: "trash-can", element: <ProfileTrashCan /> },
                    { path: "followers", element: <ProfileFollowers /> },
                    { path: "following", element: <ProfileFollowing /> },
                    { path: "post/:postId", element: <PagePost /> },
                    { path: "post/:postId/activity", element: <PagePostActivity /> },
                    { path: "post/:postId/activity/:action", element: <PagePostActivityUsers /> },
                ]
            },
            { path: "settings", element: <Settings /> },
            { path: "settings/account", element: <Account /> },
            { path: "settings/account/name", element: <AccountUsername /> },
            { path: "settings/account/username", element: <AccountUsername /> },
            { path: "settings/account/email", element: <AccountEmail /> },
            { path: "settings/account/location", element: <AccountLocation /> },
            { path: "settings/account/gender", element: <AccountGender /> },
            { path: "settings/account/birthdate", element: <AccountBirthdate /> },
            { path: "settings/account/delete", element: <AccountDelete /> },
            { path: "settings/privacy-and-security", element: <SettingsPrivacyAndSecurity /> },
            { path: "settings/appearance", element: <Appearance /> },
            { path: "settings/about", element: <SettingsAbout /> },
            {
                path: "legal",
                element: <Outlet />,
                children: [
                    { index: true, element: <Legal /> },
                    { path: "terms", element: "Términos y condiciones de uso" },
                    { path: "privacy", element: "Política de privacidad" },
                    { path: "community-guidelines", element: "Normas de la comunidad" },
                ]
            },
            { path: "/upgrade", element: <Navigate to={"/"} /> },
            { path: "/login", element: <Navigate to={"/"} /> },
            { path: "/register", element: <Navigate to={"/"} /> },
            { path: "*", element: <NoFound /> },
        ]
    },
];