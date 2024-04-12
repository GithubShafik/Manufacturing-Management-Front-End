import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Card,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { UseConstants } from "src/contexts/constants-context";
import { getTodayDate } from "src/utils/changeDateFormate";
import moment from "moment";

export default function PrintModal({ data, open, setOpen, title }) {
  const { sizes } = UseConstants();

  console.log(data);
  const handleClose = () => {
    setOpen(false);
    setShowPrint(true);
  };
  const [showPrint, setShowPrint] = React.useState(true);

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" textAlign="center">
          {title}
        </DialogTitle>
        <Box sx={{ flexGrow: 1 }}></Box>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Card>
              <Box sx={{ overflowX: "auto" }}>
                <Grid
                  container
                  justifyContent="center"
                  textAlign="center"
                  spacing={{ xs: 2, md: 3 }}
                >
                  <Grid item xs={2} sm={2} md={2}>
                    Date -{" "}
                    {data?.stockData.items[0]?.date
                      ? moment(data?.stockData.items[0].date).format("DD-MM-YYYY")
                      : getTodayDate()}
                  </Grid>
                  {/* {data?.stockData.items[0]?.subDistributor && (
                    <Grid item xs={2} sm={2} md={2}>
                      Sub Distributor - {data?.stockData.items[0]?.subDistributor}
                    </Grid>
                  )} */}
                  {data?.stockData.items[0]?.distributor && (
                    <Grid item xs={2} sm={2} md={2}>
                      Distributor - {data?.stockData.items[0]?.distributor}
                    </Grid>
                  )}
                  {data?.stockData.items[0]?.chalanNumber && (
                    <Grid item xs={2} sm={2} md={2}>
                      Chalan Number - {data?.stockData.items[0]?.chalanNumber}
                    </Grid>
                  )}
                </Grid>
                <Divider />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Code</TableCell>
                      {sizes &&
                        sizes.map((item, key) => <TableCell key={key}>{item?.name}</TableCell>)}
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.stockData &&
                      data?.stockData?.items?.map((row, key) => {
                        return (
                          <TableRow hover key={key}>
                            <TableCell>
                              <Typography variant="subtitle2">{row?.item?.itemcode}</Typography>
                            </TableCell>
                            {row?.sizes &&
                              row?.sizes?.map((item, key) => (
                                <TableCell key={key}>{item?.qty}</TableCell>
                              ))}
                            <TableCell>{row?.totalqty}</TableCell>
                          </TableRow>
                        );
                      })}
                    <TableRow>
                      <TableCell>Total</TableCell>
                      {data?.finalCountRow?.map((item, key) => (
                        <TableCell key={key}>{item}</TableCell>
                      ))}
                      <TableCell>Total : {data?.stockData.grantTotal}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
              <Divider />
            </Card>
          </DialogContentText>
        </DialogContent>
        {showPrint && (
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                setShowPrint(false);
                setTimeout(() => {
                  window.print();
                }, 1000);
              }}
            >
              Print
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
