
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import OutlinedTextField from '../common/outlined-textfield.mjs';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  margin: {
    height: theme.spacing(3),
  },
  textField: {
    margin: theme.spacing(1),
    marginLeft: 0,
    marginRight: 0,
  },
  slider: {
      width: '90%',
  }
}));

const units = [
  {
    label: 'kg',
    value: 'kg',
  }
]

export default function Quantity(props) {
  const classes = useStyles();

  var marks = [
    {   
        value: 0, 
        label: '0',
    },
    {
        value: props.Max,
        label: props.Max,
    },
]
  const [quantityState, setQuantityState] = React.useState(1);
  const [unit, setUnit] = React.useState('');

  const onChooseUnit = chosenUnit => {
    setUnit(chosenUnit);
    props.sendQuantity({value:quantityState, unit:chosenUnit});
  }
  const onTextFldChange = (e) => {
      if(e.target.value > props.Max)   setQuantityState(props.Max);   
      else setQuantityState(e.target.value);
      props.sendQuantity({value:e.target.value, unit:unit});
    }

  const handleSliderChange = (e, newValue) => {
    setQuantityState(newValue);
    props.sendQuantity({value:newValue, unit:unit});
  }

  return (
    <div className={classes.root}>
    <Grid container spacing={1}>
        <Grid item xs={6} sm={6}><TextField
                id="text-id"
                label="Quantity"        
                value={quantityState}
                onChange={onTextFldChange}
                className={classes.textField}
                variant="outlined"
                fullWidth
                error={quantityState > 0 ? false : true}
                helperText={quantityState > 0 ? "" : '*Must be greater than 0'}
        /></Grid>
        <Grid item xs={6} sm={6}><OutlinedTextField label="Unit" id="units" value={props.unit} onValueChange={onChooseUnit}  valueSetter={true} disabled={true}/></Grid>
    </Grid>
      <Slider
        id="slider-id"
        defaultValue={quantityState}
        value={quantityState}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={1}
        min={0}
        max={props.Max}
        onChange={handleSliderChange}
        marks={marks}  
        className={classes.slider}
      />
    </div>
  );
}
