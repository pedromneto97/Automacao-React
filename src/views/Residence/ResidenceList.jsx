import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

function Residence(props) {
  const { residence } = props;
  if (residence !== null) {
    return (<div>
      <p>
        <b>Name:</b> {residence.name}
      </p>
      <p>
        <b>Alias:</b> {residence.alias}
      </p>
      <p>
        <b>Type:</b> {residence.type.type}
      </p>
      <p>
        <b>Address:</b> {residence.address.street}, {residence.address.number} {residence.address.complement ? "," + residence.address.complement : null} - {residence.address.district}
      </p>
      <p>
        <b>Postal Code:</b> {residence.address.postal_code.postal_code}
      </p>
      <p>
        <b>City:</b> {residence.address.postal_code.city}
      </p>
      <p>
        <b>Province:</b> {residence.address.postal_code.province}
      </p>
      <p>
        <b>Country:</b> {residence.address.postal_code.country}
      </p>
    </div>);
  }
  return null;
}

function rooms_table(rooms) {
  let r = [];
  console.log(rooms);
  rooms.map((prop) => {
    r.push([prop.name, prop.alias, prop.icon, prop.type.type, prop.scenes.length]);
  });
  return r;
}

class ResidenceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      residence: null,
      alias: props.match.params.alias,
      interval: null
    };
  }

  componentWillMount(): void {
    if (!this.getResidence()) {
      this.setState({
        interval: setInterval(this.getResidence, 100)
      });
    }
  }

  componentWillUnmount(): void {
    if (this.state.interval !== null) {
      clearInterval(this.state.interval);
    }
  }

  getResidence = () => {
    if (this.props.session) {
      this.props.session.call("com.herokuapp.crossbar-pedro.residence.alias", [this.state.alias])
        .then(function(res) {
          res = JSON.parse(res);
          this.setState({
            residence: res ? res : null
          });
          console.log(this.state.residence);
        }.bind(this))
        .catch(function(error) {
          console.error(error);
        });
      clearInterval(this.state.interval);
      this.setState({
        interval: null
      });
      return true;
    }
    return false;
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Residence Info</h4>
            </CardHeader>
            <CardBody>
              <Residence residence={this.state.residence}/>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                Residence Rooms
              </h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Name", "Alias", "Icon", "Type", "Scenes Items"]}
                tableData={this.state.residence ? rooms_table(this.state.residence.rooms) : []}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  };
}

export default withStyles(styles)(ResidenceList);