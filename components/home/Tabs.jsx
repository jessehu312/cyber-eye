import { useRef, useState } from "react";

const crimeTypes = [
  "All",
  "Burglary",
  "Child Abuse",
  "Drugs",
  "Fraud",
  "Homicide",
  "Robbery",
  "Theft",
  "Vandalism",
  "Trespass",
];

const Tab = ({ icon, value, active, children, onClick }) => {
  const ref = useRef();
  const bubble = (event) => {
    let element = event.target;
    while (element !== ref.current) {
      element = element.parentElement;
    }
    onClick(element);
    return false;
  };
  return (
    <div
      ref={ref}
      onClick={bubble}
      data-value={value}
      className={`inline-block cursor-pointer rounded-2xl shadow-sm p-2 ${
        active ? "bg-primary text-secondary" : "bg-secondary text-white border"
      } text-sm font-semibold`}>
      {icon && <img src={icon} />}
      {children && <p>{children}</p>}
    </div>
  );
};

const Tabs = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const onClickTabItem = (tab) => {
    setSelectedTab(tab.dataset.value);
  };
  return (
    <div className='w-full flex flex-col md:flex-row space-y-4 flex-wrap max-w-xs mx-auto md:max-w-screen-xl md:space-y-0 justify-between'>
      {crimeTypes.map((type, idx) => (
        <Tab
          active={selectedTab == type}
          key={idx}
          value={type}
          onClick={onClickTabItem}>
          🔥 {type}
        </Tab>
      ))}
    </div>
  );
};

export default Tabs;
