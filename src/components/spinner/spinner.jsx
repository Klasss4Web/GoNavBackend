import "./spinner.css";

export const Spinner = ({ themeColor }) => {
  return <div className="spinner" style={{ borderTopColor: themeColor }}></div>;
};
