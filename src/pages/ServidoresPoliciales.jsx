import "./styles/HomePage.css";
import FromServidorP from "../components/HomePage/FromServidorP";
import TablaOrganico from "../components/HomePage/TablaOrganico";
import FormLegalizacion from "../components/HomePage/FormLegalizacion";
import ServidoresPolicialesList from "../components/HomePage/ServidoresPolicialesList";

const ServidoresPoliciales = () => {
  return (
    <div>
    <FromServidorP />
    {/* <TablaOrganico /> */}
    {/* <FormLegalizacion/> */}
    <ServidoresPolicialesList/>
  </div>
  )
}

export default ServidoresPoliciales