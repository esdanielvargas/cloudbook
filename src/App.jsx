import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthLayout, AppLayout, PreferencesLayout } from "./layouts";
import {
  Appearance,
  Archive,
  CustomFeed,
  Favorites,
  FeedCreate,
  Feeds,
  Following,
  Home,
  Login,
  Mutuals,
  NoFound,
  PagePostActivity,
  PagePostActivityUsers,
  Preferences,
  PreferencesHashtags,
  PreferencesTopics,
  PreferencesUsers,
  ProfileEdit,
  ProfileFollowers,
  ProfileFollowing,
  ProfileInfo,
  Register,
  SearchMain,
  SearchPosts,
  SearchUsers,
  Settings,
  SettingsAbout,
  SettingsAccount,
  SettingsAccountLocation,
  SettingsAccountUsername,
  SettingsPrivacyAndSecurity,
} from "./pages";
import { lazy, Suspense } from "react";
import { Loader, ScrollToTop } from "./components";
import {
  ProfileMedia,
  ProfileMusic,
  ProfilePosts,
  ProfileReposts,
  ProfileSaved,
} from "./components/profile";
import Bug from "./pages/Bug";

const ForYou = lazy(() => import("./pages/ForYou"));
const Search = lazy(() => import("./pages/Search"));
const Compose = lazy(() => import("./pages/Compose"));
const Chats = lazy(() => import("./pages/Chats"));
const Notify = lazy(() => import("./pages/Notify"));
const Profile = lazy(() => import("./pages/Profile"));
const PagePost = lazy(() => import("./pages/PagePost"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/loader" element={<Loader />} />
          {/*  */}
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<Home />}>
              <Route index element={<ForYou />} />
              <Route path="/following" element={<Following />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/mutuals" element={<Mutuals />} />
              <Route path="/feeds/:id" element={<CustomFeed />} />
            </Route>
            <Route path="/feeds" element={<Feeds />} />
            <Route
              path="/feeds/create"
              element={<FeedCreate title="Nuevo feed" />}
            />
            {/* <Route path="/feeds/:id" element={<CustomFeed edit />} /> */}
            <Route path="/feeds/:id/edit" element={<CustomFeed edit />} />
            {/* <Route path="/search" element={<Search />}> */}
            {/* <Route index element={<SearchMain />} /> */}
            <Route path="/search" element={<Search />} />
            <Route path="/search/profiles" element={<SearchUsers />} />
            <Route path="/search/posts" element={<SearchPosts />} />
            <Route path="/search/posts/:hashtag" element={<SearchPosts />} />
            <Route
              path="/news"
              element={
                <Suspense fallback={<Loader />}>
                  <div className="size-full flex flex-col items-center justify-center">
                    <div className="font-extrabold text-4xl font-sans select-none pointer-events-none">
                      Cloud Premiun
                    </div>
                  </div>
                </Suspense>
              }
            />
            <Route path="/compose" element={<Compose />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/notify" element={<Notify />} />
            <Route path="/:username" element={<Profile />}>
              <Route index element={<ProfilePosts />} />
              <Route path="/:username/media" element={<ProfileMedia />} />
              <Route path="/:username/reposts" element={<ProfileReposts />} />
              <Route path="/:username/music" element={<ProfileMusic />} />
              <Route path="/:username/saved" element={<ProfileSaved />} />
              <Route
                path="/:username/collections"
                element={<>Collectiones</>}
              />
              <Route path="/:username/shop" element={<>Tienda</>} />
            </Route>
            <Route path="/:username/info" element={<ProfileInfo />} />
            <Route path="/:username/edit" element={<ProfileEdit />} />
            <Route path="/:username/archive" element={<Archive />} />
            <Route path="/:username/post/:postId" element={<PagePost />} />
            <Route path="/:username/followers" element={<ProfileFollowers />} />
            <Route path="/:username/following" element={<ProfileFollowing />} />
            <Route
              path="/:username/post/:postId/activity"
              element={<PagePostActivity />}
            />
            <Route
              path="/:username/post/:postId/activity/:action"
              element={<PagePostActivityUsers />}
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/account" element={<SettingsAccount />} />
            <Route path="/settings/account/username" element={<SettingsAccountUsername />} />
            <Route path="/settings/account/location" element={<SettingsAccountLocation />} />
            <Route path="/settings/privacy-and-security" element={<SettingsPrivacyAndSecurity />} />
            <Route path="/settings/appearance" element={<Appearance />} />
            <Route path="/settings/about" element={<SettingsAbout />} />
            <Route path="*" element={<NoFound />} />
          </Route>
          {/*  */}
          <Route path="/preferences" element={<PreferencesLayout />}>
            <Route index element={<Preferences />} />
            <Route path="/preferences/users" element={<PreferencesUsers />} />
            <Route path="/preferences/topics" element={<PreferencesTopics />} />
            <Route
              path="/preferences/hashtags"
              element={<PreferencesHashtags />}
            />
          </Route>
          {/*  */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<>Error</>} />
          </Route>
          <Route path="/bug" element={<Bug />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
