import EntidadSimpleAdmin from "../../components/EntidadSimpleAdmin";

const AdminColecciones = () => {
  return (
    <EntidadSimpleAdmin
      titulo="Colecciones"
      endpoint="colecciones"
      nombreEntidadSingular="colección"
    />
  );
};

export default AdminColecciones;

