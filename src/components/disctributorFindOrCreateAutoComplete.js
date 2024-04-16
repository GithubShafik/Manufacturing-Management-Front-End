import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { getalldistributors, savedistributor } from "request/distributors";
import { CircularProgress } from "@mui/material";

const filter = createFilterOptions();

export default function DistributorFindOrCreateAutoComplete({ setDistributorID }) {
  const [items, setItems] = React.useState([]);

  const getAllDistributorList = () => {
    getalldistributors().then((res) => {
      setItems(res.result);
    });
  };
  React.useEffect(() => {
    getAllDistributorList();
  }, []);

  const [distributor, setDistributor] = React.useState(null);
  const [addNewModalopen, setaddNewModalOpen] = React.useState(false);

  const handleClose = () => {
    setDialogValue({
      name: "",
    });
    setaddNewModalOpen(false);
  };

  const [dialogValue, setDialogValue] = React.useState({
    name: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show the loader

    try {
      const res = await savedistributor(dialogValue);
      if (res && res.status === "success") {
        const res2 = await getalldistributors();
        if (res2 && res2.status === "success") {
          setItems(res2.result);
          setTimeout(() => {
            setDistributor({
              name: res.result.name,
            });
            handleClose();
            setLoading(false);
          }, 1000);
        }
      }
      if (res) {
        setDistributorID(res.result?._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isDistributorExists = (value) => {
    return items.some((item) => item.name === value);
  };

  return (
    <React.Fragment>
      <Autocomplete
        value={distributor}
        onChange={(event, value) => {
          if (typeof value === "string") {
            setTimeout(() => {
              setaddNewModalOpen(true);
              setDialogValue({
                name: value,
              });
            });
          } else if (value && value.inputValue) {
            setaddNewModalOpen(true);
            setDialogValue({
              name: value.inputValue,
            });
          } else {
            setDistributorID(value?._id);
            setDistributor(value);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "" && !isDistributorExists(params.inputValue)) {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
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
          return option.name;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        sx={{ width: 150 }}
        freeSolo
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            label="Enter Distributor"
            style={{ width: 150 }}
          />
        )}
      />

      <Dialog open={addNewModalopen} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new Distributor</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any Distributor in our list? Please, add it!
            </DialogContentText>
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
              label="Distributor"
              type="text"
              variant="standard"
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
