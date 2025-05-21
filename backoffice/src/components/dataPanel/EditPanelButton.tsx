import { Button, Typography } from "@mui/material";
import { IEntityLink } from "entities/IEntityLink";
import { FunctionComponent, ReactNode } from "react";

interface EditPanelButtonProps {
  onClick: () => void;
  links?: IEntityLink[];
  children?: ReactNode;
}

interface PanelButtonProps {
  onClick: () => void;
  children?: ReactNode;
}

export const EditPanelButton: FunctionComponent<EditPanelButtonProps> = ({
  onClick,
  links,
  children,
}): JSX.Element => {
  const canEdit = links == null || links.some((link) => link.verb === "PATCH");
  return canEdit ? (
    <PanelButton onClick={onClick}>{children}</PanelButton>
  ) : (
    <></>
  );
};

export const PanelButton: FunctionComponent<PanelButtonProps> = ({
  onClick,
  children,
}): JSX.Element => {
  return (
    <Typography align="right" style={{ paddingRight: "5em" }}>
      <Button variant="outlined" onClick={onClick}>
        {children}
      </Button>
    </Typography>
  );
};
