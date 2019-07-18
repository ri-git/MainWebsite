import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography, withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import TreeView from '../components/TreeView';
import { fetchResources as fetchResourcesAction } from '../actions/allActions';
import CustomModal from '../components/CustomModal';

const styles = theme => ({
  centerText: {
    textAlign: 'center',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: theme.spacing(10),
  },
  list: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(10),
  },
  loadingCircle: {
    color: '#6798e5',
    animationDuration: '600ms',
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
});

function processResourceData(data) {
  if (data === undefined) {
    return { archive: {}, new: {} };
  }

  const processedData = { archive: {}, new: {} };

  data.forEach((entry) => {
    if (entry.archive === 'Y') {
      if (processedData.archive[entry.directory_year] === undefined) {
        processedData.archive[entry.directory_year] = {};
      }
      if (processedData.archive[entry.directory_year][entry.sub_directory] === undefined) {
        processedData.archive[entry.directory_year][entry.sub_directory] = [];
      }

      processedData.archive[entry.directory_year][entry.sub_directory].push(entry);
    } else {
      if (processedData.new[entry.directory_year] === undefined) {
        processedData.new[entry.directory_year] = {};
      }
      if (processedData.new[entry.directory_year][entry.sub_directory] === undefined) {
        processedData.new[entry.directory_year][entry.sub_directory] = [];
      }

      processedData.new[entry.directory_year][entry.sub_directory].push(entry);
    }
  });

  return processedData;
}

const mapStateToProps = state => ({
  data: state.completeReducer.data.resources,
  isLoading: state.completeReducer.isLoading.resources,
  error: state.completeReducer.errorFetching.resources,
});

const mapDispatchToProps = dispatch => ({
  fetchResources: () => dispatch(fetchResourcesAction()),
});

class Misc extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    if (data === undefined || data.length === 0) {
      const { fetchResources } = this.props;
      fetchResources();
    }
  }

  render() {
    const { data, classes, isLoading } = this.props;

    if (isLoading !== false) {
      return (
        <CircularProgress disableShrink size={50} className={classes.loadingCircle} />
      );
    }
    const processedData = processResourceData(data);

    return (
      <React.Fragment>
        <Typography gutterBottom variant="h5" className={classes.centerText}>
          Resources
        </Typography>
        <Container maxWidth="sm">
          <CustomModal
            url="Misc"
            id="Misc"
            title="Misc"
          />
          <div className={classes.list}>
            <TreeView data={processedData.archive} isLoading={isLoading} />
            <TreeView data={processedData.new} isLoading={isLoading} />
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

Misc.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  fetchResources: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

Misc.defaultProps = {
  data: [],
  isLoading: true,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Misc));
