import { Navigate, useParams } from "react-router-dom";

function AttendeesRedirect() {
  const { id } = useParams();
  return <Navigate to={`/organizer/attendees?event=${id}`} replace />;
}

export default AttendeesRedirect;
