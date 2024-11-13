import "./styles/HomePage.css";
import TablaOrganico from "../components/HomePage/TablaOrganico";
import ResumenTh from "../components/HomePage/ResumenTh";
import DireccionesList from "../components/HomePage/DireccionesList";

const HomePage = () => {
  return (
    <div>
      <DireccionesList />
      <ResumenTh />
      <TablaOrganico />
    </div>
  );
};

export default HomePage;
