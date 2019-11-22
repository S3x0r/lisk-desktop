import React from 'react';
import Box from '../../../toolbox/box';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import BoxHeader from '../../../toolbox/box/header';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';

const LatestVotes = ({ votes }) => (
  <Box isLoading={votes.isLoading}>
    <BoxHeader><h2>Latest votes</h2></BoxHeader>
    {votes.error
      ? <BoxEmptyState><h3>{`${votes.error}`}</h3></BoxEmptyState>
      : (
        <pre>
          {JSON.stringify(votes.data, null, 2)}
        </pre>
      )
    }
  </Box>
);

export default withData({
  votes: {
    apiUtil: liskService.getLatestVotes,
    autoload: true,
  },
})(LatestVotes);
