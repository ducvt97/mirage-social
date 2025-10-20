"use client";
import useLoading from "@/hooks/useLoading";
import { useAppSelector } from "@/stores/hooks";

import { styled } from "@mui/material/styles";

const LoadingComponent = styled("div")({
  width: "100vw",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1300,
  pointerEvents: "none",
  cursor: "default",
  background:
    'rgba(255, 255, 255, 0.7) url("/loading.svg") no-repeat center',
  backgroundSize: "100px",
});

const AppLoading = () => {
  const isLoading = useAppSelector((state) => state.appState.isLoading);

  return <LoadingComponent className={isLoading ? "block" : "hidden"} />;
};

export default AppLoading;
