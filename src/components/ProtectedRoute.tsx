import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../main";

interface Props {
  children: JSX.Element;
  roles?: string[];
}

/*interface TokenPayload {
  role: string;
}*/

export const ProtectedRoute = ({ children, roles }: Props) => {
  //const token = localStorage.getItem("token");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const userRole = getUserRole();
  
  if ( !userRole ) {
    return <Navigate to="/" replace />;
  } else if( roles && !roles.includes( userRole ) ) {
    return <Navigate to="/" replace />;
  }
//|| ( roles && roles.length > 0 )
  //let decoded: TokenPayload | null = null;

  //try {
  //  decoded = jwtDecode<TokenPayload>(token);
  //} catch {
  //  return <Navigate to="/" replace />;
  //}

  //const userRole = decoded?.role?.toLowerCase();

  return children;
};
