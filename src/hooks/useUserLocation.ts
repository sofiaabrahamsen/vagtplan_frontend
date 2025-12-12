import { useEffect, useState } from "react";

export interface UserLocaStionState {
  lat: number | null;
  lon: number | null;
  loading: boolean;
  error: string | null;
  permission: "unknown" | "granted" | "denied";
}

export const useUserLocation = () => {
  const [state, setState] = useState<UserLocaStionState>({
    lat: null,
    lon: null,
    loading: true,
    error: null,
    permission: "unknown",
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({
        lat: null,
        lon: null,
        loading: false,
        error: "Geolocation is not supported by this browser.",
        permission: "denied",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          loading: false,
          error: null,
          permission: "granted",
        });
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied."
            : err.code === err.POSITION_UNAVAILABLE
            ? "Location unavailable."
            : "Location request timed out.";

        setState({
          lat: null,
          lon: null,
          loading: false,
          error: msg,
          permission: err.code === err.PERMISSION_DENIED ? "denied" : "unknown",
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 1000 * 60 * 10,
      }
    );
  }, []);

  return state;
};
