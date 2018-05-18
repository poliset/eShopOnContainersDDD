import * as React from 'react';
import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';

import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { sort } from '../../../utils';
import { Using, Formatted } from '../../../components/models';
import { CheckoutStoreType, CheckoutStoreModel } from '../stores/checkout';

import CheckoutAddress from '../components/checkoutAddress';
import CheckoutPayment from '../components/checkoutPayment';
import CheckoutConfirm from '../components/checkoutConfirm';

interface CheckoutProps {
  store?: CheckoutStoreType;
}

const styles = (theme: Theme) => ({
  avatarQuantity: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    margin: theme.spacing.unit
  },
  avatar: {
    margin: 10,
    width: 60,
    height: 60
  },
  totals: {
    width: '100vw'
  }
});

@observer
class CheckoutView extends React.Component<CheckoutProps & WithStyles<'avatar' | 'avatarQuantity' | 'totals'>, { activeStep: number }> {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0
    };
  }
  public componentDidMount() {
    const { store } = this.props;

    store.validateBasket();
  }

  private handleNext = () => {
    const { activeStep } = this.state;
    this.setState({activeStep: activeStep + 1});
  }
  private handlePrev = () => {
    const { activeStep } = this.state;
    this.setState({activeStep: activeStep - 1});
  }

  public render() {
    const { store, classes } = this.props;
    const { activeStep } = this.state;

    const items = sort(Array.from(store.items.values()), 'productId');
    return (
      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Grid container spacing={24}>
            <Grid item xs={12} md={8}>
              <Paper elevation={4}>
                <Stepper activeStep={activeStep}>
                  <Step completed={false}>
                    <StepLabel>Address</StepLabel>
                  </Step>
                  <Step completed={false}>
                    <StepLabel>Payment</StepLabel>
                  </Step>
                  <Step completed={false}>
                    <StepLabel>Confirm</StepLabel>
                  </Step>
                </Stepper>
                <div>
                  {activeStep === 0 && <CheckoutAddress checkout={store} handleNext={this.handleNext} handlePrev={this.handlePrev}/>}
                  {activeStep === 1 && <CheckoutPayment checkout={store} handleNext={this.handleNext} handlePrev={this.handlePrev}/>}
                  {activeStep === 2 && <CheckoutConfirm checkout={store} handleNext={this.handleNext} handlePrev={this.handlePrev}/>}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={4}>
                <Using model={store.basket}>
                <List>
                  {items.map(item => (
                    <Using model={item} key={item.id}>
                      <ListItem>
                        <Avatar src={item.productPicture} className={classes.avatar} />
                        <ListItemText primary={item.productName} secondary={item.productDescription} />
                        <ListItemSecondaryAction>
                          <Avatar className={classes.avatarQuantity}>{item.quantity}</Avatar>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Using>
                  ))}
                  <Divider/>
                  <ListItem>
                    <Typography variant='title' color='primary' align='right' className={classes.totals}>SubTotal: <Formatted field='subTotal'/></Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant='subheading' color='primary' align='right' className={classes.totals}>Fees:</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant='subheading' color='primary' align='right' className={classes.totals}>Taxes:</Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant='title' color='primary' align='right' className={classes.totals}>Total:</Typography>
                  </ListItem>
                </List>
                </Using>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default hot(module)(withStyles(styles as any)(CheckoutView));