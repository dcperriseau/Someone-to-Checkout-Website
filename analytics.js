import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("YOUR_MEASUREMENT_ID");
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
};
