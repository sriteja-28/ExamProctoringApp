import React from "react";
import { TableCell } from "@mui/material";

const StyledTableCell = ({ children, ...props }) => {
  return (
    <TableCell
      sx={{
        color: "#0B5A72",
        fontWeight: "bold",
        fontSize: "1rem",
      }}
      {...props}
    >
      {children}
    </TableCell>
  );
};

export default StyledTableCell;
