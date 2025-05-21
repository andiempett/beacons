import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Button, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

interface IPanelError {
  message?: string;
  children?: ReactNode;
}

export const ErrorState: FunctionComponent<IPanelError> = ({
  message,
  children,
}): JSX.Element => (
  <Box role="alert" textAlign="center">
    <ErrorOutlineIcon />
    <Typography>{message ?? children}</Typography>
    <Button
      onClick={() => {
        window.location.reload();
      }}
    >
      Click here to refresh the page
    </Button>
  </Box>
);
