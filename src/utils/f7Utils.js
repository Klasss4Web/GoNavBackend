import { f7 } from "framework7-react";

export const navigate = (route) => {
  f7.views.main.router.navigate(route);
};
