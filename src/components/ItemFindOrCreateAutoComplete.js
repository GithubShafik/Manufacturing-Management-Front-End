import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { getallitems, saveitem } from "request/items";
import { CircularProgress } from "@mui/material";

const filter = createFilterOptions();

export default function ItemFindOrCreateAutoComplete({ setItemID }) {
  const [items, setItems] = React.useState([]);

  const getAllItemsList = () => {
    getallitems().then((res) => {
      setItems(res.result);
    });
  };
  React.useEffect(() => {
    getAllItemsList();
  }, []);

  const [itemCode, setItemCode] = React.useState();
  const [addNewModalopen, setaddNewModalOpen] = React.useState(false);

  const handleClose = () => {
    setDialogValue({
      itemcode: "",
      name: "",
    });
    setaddNewModalOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    itemcode: "",
    name: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show the loader

    try {
      const res = await saveitem(dialogValue);
      if (res && res.status === "success") {
        const res2 = await getallitems();
        if (res2 && res2.status === "success") {
          setItems(res2.result);
          setTimeout(() => {
            setItemCode({
              itemCode: res.result.itemcode,
            });
            handleClose(true);
            setLoading(false);
          }, 1000);
        }
      }
      if (res) {
        setItemID(res.result?._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isItemCodeExists = (value) => {
    return items.some((item) => item.itemcode === value);
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={itemCode}
        onChange={(event, value) => {
          if (typeof value === "string") {
            setTimeout(() => {
              setaddNewModalOpen(true);
              setDialogValue({
                itemcode: value,
              });
            });
          } else if (value && value.inputValue) {
            setaddNewModalOpen(true);
            setDialogValue({
              itemcode: value.inputValue,
            });
          } else {
            setItemID(value?._id);
            setItemCode(value);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "" && !isItemCodeExists(params.inputValue)) {
            filtered.push({
              inputValue: params.inputValue,
              itemcode: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        id="free-solo-dialog-demo"
        options={items}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.itemcode;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.itemcode}</li>}
        sx={{ width: 150 }}
        freeSolo
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            label="Enter Design Code"
            style={{ width: 150 }}
          />
        )}
      />

      <Dialog open={addNewModalopen} onClose={handleClose} >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new design code</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any design code in our list? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="itemcode"
              value={dialogValue.itemcode}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  itemcode: event.target.value,
                })
              }
              label="Design Code"
              type="text"
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.name}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  name: event.target.value,
                })
              }
              label="Description"
              type="text"
              variant="standard"
              sx={{width: '150px'}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {loading ? <CircularProgress size="2rem" /> : <Button type="submit">Add</Button>}
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
