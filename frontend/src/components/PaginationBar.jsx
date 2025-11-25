import React from "react";
import { Pagination, Stack } from "@mui/material";

const PaginationBar = ({ page, pages, onChange }) => {
  return (
    <Stack alignItems="center" mt={4} mb={2}>
      <Pagination
        count={pages}
        page={page}
        onChange={(e, val) => onChange(val)}
        color="primary"
        size="large"
        shape="rounded"
      />
    </Stack>
  );
};

export default PaginationBar;
