import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Button,
  Card,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ItemFindOrCreateAutoComplete from "src/components/ItemFindOrCreateAutoComplete";
import { Scrollbar } from "src/components/scrollbar";
import { UseConstants } from "src/contexts/constants-context";
import { getTodayDate } from "src/utils/changeDateFormate";

const ItemSizeForm = ({ addFunction }) => {
  const { sizes } = UseConstants();
  const [itemID, setItemID] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [sizeQtyData, setSizeQtyData] = useState([]);

  const handleSubmit = () => {
    if (!itemID) {
      alert("Please Select Item");
      return;
    }
    if (!date) {
      alert("Please Select Date");
      return;
    }

    toast.promise(addFunction(date, itemID, sizeQtyData), {
      loading: "Saving...",
      success: <b>Saved Successfully!</b>,
      error: <b>Could Not Save Please Check Input Values!!!!</b>,
    });
    setItemID();
    setDate(getTodayDate());
    setSizeQtyData([]);
  };
  const onInputChange = (e) => {
    let sizeID = e.target.name;
    let qty = parseInt(e.target.value);
    let index = sizeQtyData.findIndex((item) => item.sizeID === sizeID);

    if (index !== -1) {
      let tempArray = sizeQtyData;
      tempArray[index].qty = qty;
      setSizeQtyData(tempArray);
    } else {
      setSizeQtyData((prevData) => [...prevData, { sizeID: sizeID, qty: qty }]);
    }
  };
  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={true} />
      </div>

      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Design Code</TableCell>
                  {sizes && sizes.map((item, key) => <TableCell key={key}>{item?.name}</TableCell>)}
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>
                    <TextField
                      name={"date"}
                      id={"date"}
                      placeholder="select date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                      variant="standard"
                      style={{ fontSize: "0.20rem" }}
                      type="date"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={2}>
                      <ItemFindOrCreateAutoComplete setItemID={setItemID} />
                    </Stack>
                  </TableCell>
                  {sizes &&
                    sizes.map((item, key) => (
                      <TableCell key={key}>
                        <TextField
                          name={`${item._id}`}
                          id={`${item._id}`}
                          placeholder="0"
                          variant="standard"
                          InputProps={{ style: { fontSize: "0.20rem", width: "33px" } }} // Fixed width
                          type="number"
                          onChange={onInputChange}
                        />
                      </TableCell>
                    ))}

                  <TableCell align="center">
                    <Button
                      onClick={handleSubmit}
                      type="submit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default ItemSizeForm;
