import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import QuotationTable from './quotationTable.mjs';

const useStyles = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(1),
    }
  }));

export default function Inventory(props) {
    const classes = useStyles();

    return (
    <React.Fragment>
        <CssBaseline />        
        <div className={classes.paper}>
            <QuotationTable />
        </div>
        
    </React.Fragment>
  );
}
