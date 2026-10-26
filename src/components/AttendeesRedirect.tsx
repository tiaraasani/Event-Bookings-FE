import { Navigate, useParams } from "react-router-dom";

// Old attendee URL (/organizer/events/:id/attendees) still works: it forwards
// to the attendees page with the event preselected.
function AttendeesRedirect() {
  const { id } = useParams();
  return <Navigate to={`/organizer/attendees?event=${id}`} replace />;
}

export default AttendeesRedirect;
