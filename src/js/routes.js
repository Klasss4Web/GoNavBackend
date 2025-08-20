import LandingPage from "../pages/landingPage.jsx";
import RoutePage from "../pages/routePage.jsx";
// @ts-ignore
import TrackMap from "../pages/trackMap.jsx";
var routes = [
  {
    path: "/",
    component: LandingPage,
  },
  {
    path: "/route-page/",
    component: RoutePage,
  },
  {
    path: "/track-map/",
    component: TrackMap,
  },
];

export default routes;
