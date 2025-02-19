import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import DropDownSelect from '../common/dropdown-select.mjs';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import SuggestionSelect from '../common/suggestion-select.mjs';
import OKAlert from '../common/ok-alert.mjs';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OutlinedTextField from '../common/outlined-textfield.mjs';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    alignSelf: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

var productsList = [];
var unitsList = [];

var haveFetchedCategories = false;
var haveFetchedProducts = false;
var haveFetchedDepts = false;
var productIsAvailable = false;
var haveCheckedLocalStorage = false;
var productAlreadyChosen = false;
var haveFetchedUnitTypes = false;
var haveFetchedUnits = false;

export default function Request() {

    const classes = useStyles();
    const [state, setState] = React.useState({
      category: '',
      product: {
        id: '',
        name: '',
        description: '',
      }
    });

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
      if(inputLabel.current) setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleChange = name => event => {
      setState({
        ...state,
        [name]: event.target.value,
      });
    };

    const [fetchedCategories, setFetchedCategories] = React.useState({categories: []});
    const [JSONCategories, setJSONCategories] = React.useState({});
    const [fetchedUnitTypes, setFetchedUnitTypes] = React.useState({unitTypes: []});
    const [selectedTypeUnits, setSelectedTypeUnits] = React.useState({units: []});
    const [selectedCategoryProducts, setSelectedCategoryProducts] = React.useState({productsNameList: [], productsValueList: []});
    const [fetchedDepts, setFetchDepts] = React.useState({departments: []});
    const [quantity , setQuantity] = React.useState(1);
    const [toDept, setToDept] = React.useState('');
    const [unit, setUnit] = React.useState('');
    const [Max, setMax] = React.useState(100);
    const [alertState, setAlertState] = React.useState({show: false, message:'', title:''});
    const [departments, setDepartments] = React.useState({});
    const department = localStorage.getItem('department');
    const [requestState, setRequestState] = React.useState(false);

    const fetchCategories = () => {
      fetch('/list/categories')
      .then(list => {
        return list.json();
      }).then(data => {
        setFetchedCategories({
          categories: data.items,
        });
        haveFetchedCategories = true;
        data.items.unshift({value:'', label:''});
        var cats = data.items.reduce((map, cItem) => {
          map[cItem.value] = cItem.label;
          return map;
        });
        setJSONCategories(cats);
      });
    }
    
    const fetchProducts = () => {
      fetch('/product')
      .then(list => {
        return list.json();
      }).then(data => {
        console.log(data);
        productsList = Array.isArray(data) ? data : [];
        haveFetchedProducts = true;
      });
    }

    const fetchDepartments = () => {
      haveFetchedDepts = true;
      fetch('/list/departments')
      .then(list => {
        return list.json();
      }).then(data => {
        setFetchDepts({
          departments: data.items.filter(item => {return item.value!==localStorage.getItem('department')}),
        });
        data.items.unshift({value:'', label:''});
        var depts = data.items.reduce((map, dItem) => {
          map[dItem.value] = dItem.label;
          return map;
        });
        setDepartments(depts);
      });
    }
        const fetchUnits = () => {
    fetch('/list/units')
    .then(list => {
      return list.json();
    }).then(data => {
      unitsList = data.items;
      haveFetchedUnits = true;
    });
  }
  
  const fetchUnitTypes = () => {
    fetch('/list/unitTypes')
    .then(list => {
      return list.json();
    }).then(data => {
      setFetchedUnitTypes({
        unitTypes: data.items,
      });
      haveFetchedUnitTypes = true;
    });
  }
  
    const checkLocalStorage = () => {
      haveCheckedLocalStorage = true;
      var productForRequest = JSON.parse(localStorage.getItem('productForRequest'));
      if(productForRequest){
        localStorage.removeItem('productForRequest');
        productAlreadyChosen = true;
        setState({
          category: productForRequest.details.category,
          product: {
            id: productForRequest.details._id,
            name: productForRequest.details.name,
            description: productForRequest.details.description,
          }
        });
        setUnit(productForRequest.quantity.unit);
        setMax(productForRequest.quantity.value);
      }else{
        productForRequest = JSON.parse(localStorage.getItem('onlyProductForRequest'));
        if(productForRequest){
          localStorage.removeItem('onlyProductForRequest');
          productAlreadyChosen = true;
          setState({
            category: productForRequest.category,
            product: {
              id: productForRequest._id,
              name: productForRequest.name,
              description: productForRequest.description,
            }
          });
        }
      }
    }

    haveFetchedCategories || fetchCategories();
    haveCheckedLocalStorage || checkLocalStorage();
    haveFetchedCategories || fetchCategories();
    haveFetchedProducts || fetchProducts();
    haveFetchedDepts || fetchDepartments();
    haveFetchedUnitTypes || fetchUnitTypes();
    haveFetchedUnits || fetchUnits();

    const onChooseCategory = chosenCategory => {
    console.log(selectedCategoryProducts);
        setState({
        ...state,
        category: chosenCategory,
        product: {
          id: '',
          name: '',
          description: '',
        }
      });
      setSelectedCategoryProducts({
        productsNameList: productsList
          .filter(product => {
              return product.category==chosenCategory;
          })
          .map(product => ({
            value: product._id,
            label: product.name,
          })),
      });
      setUnit('');
    };

  const onChooseQuantityType = chosenQuantityType => {
    setState({
      ...state,
      quantityType: chosenQuantityType,
    });
    setSelectedTypeUnits({
      units: unitsList
        .filter(uItem => { return uItem.label==chosenQuantityType; })
        .map(uItem => ({label: uItem.value, value: uItem.value}))
    });
  };
  const onChooseQuantityUnit = chosenUnit => {
    setUnit(chosenUnit);
  };

    const onChooseProductName = chosenProduct => {
        if(chosenProduct)
          {var prod = productsList.filter(pItem => {return pItem._id==chosenProduct.value});
          if(prod.length == 0){
            productIsAvailable = false;
          }else{
            console.log("PNAME");
            console.log(chosenProduct);
            setState({
              ...state,
              product: {
                id: chosenProduct.value,
                name: chosenProduct.label,
                description: "",
              }
            });
          }}   
    }

    const onChooseToDept = chosenDept => {
      setToDept(chosenDept);
    }

    const getQuantity = quantityFromChild => {
      setQuantity(quantityFromChild.value);
    }

    const requestItem = () => {
      return new Promise((resolve, reject) => {
        var requestIt = {
          productID: state.product.id,
          departmentID: department,
          qValue: parseFloat(document.getElementById('quantity-value').value),
          qUnit: unit,
        };
      console.log("Reqit created");console.log(requestIt);
        fetch('/request',{
          method: 'POST',
          body: JSON.stringify(requestIt),
          headers:{'Content-Type': 'application/json'}
       })
        .then(res => {
          res.json()
          .then(result => {
            if(res.ok) resolve(result);
            else reject(result);  
          })
          .catch(error => {reject(error);});
        })
        .catch(error => {reject(error);});
      });
    }

    const submitForm = () => {
      requestItem()
      .then(result => {
        console.log(result);
        setAlertState({
          show: true,
          message: result, 
          title: "Request successful",
        });
        setRequestState(true);
      })
      .catch(error => {
        setAlertState({
          show: true,
          message: error,
          title: "Request failed",
        });
        setRequestState(true);
      })
    }

    const closeAlert = () => {
      setAlertState({
        show: false,
        message: "",
        title: "",
      });
      if(requestState) window.location.href = '/pendingRequests';
    }
  
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
        <div className={classes.paper} id="request-div">
          <Avatar className={classes.avatar}>
              <SwapHorizIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Request an Item
          </Typography>
          <form className={classes.form} noValidate >
              { !productAlreadyChosen ?
              <React.Fragment>
                <DropDownSelect id="product-category" label="Product Category" items={fetchedCategories.categories} onValueChange={onChooseCategory} />
                <SuggestionSelect id="product-name" label="Product Name" category={state.category} items={selectedCategoryProducts.productsNameList} onValueChange={onChooseProductName} nonCreatable={true}/>
              </React.Fragment> : <React.Fragment>
                <OutlinedTextField id="product-category" label="Product Category" value={JSONCategories[state.category]} valueSetter={true} disabled={true}/> 
                <OutlinedTextField id="product-name" label="Product Name" value={state.product.name} valueSetter={true} disabled={true}/> 
              </React.Fragment>
              }
              <DropDownSelect id="product-type" label="Measure of quantity" items={fetchedUnitTypes.unitTypes} onValueChange={onChooseQuantityType}/>
              <OutlinedTextField id="quantity-value" label="Quantity to Request" disabled={false} halfWidth={true} />
          <a>&nbsp;&nbsp;&nbsp;</a>
          <DropDownSelect id="quantity-unit" label="Unit" items={selectedTypeUnits.units} halfWidth={true} onValueChange={onChooseQuantityUnit}/>
              <Button
                onClick={submitForm}
                variant="contained"
                color="primary"
                className={classes.submit}
              >
            Confirm Request
          </Button>
          </form>
        </div>
        <div className={classes.paper} id="response-div">
        <OKAlert show={alertState.show} title={alertState.title} message={alertState.message} onClose={closeAlert}/>
      </div>
    </Container>
      );
}

