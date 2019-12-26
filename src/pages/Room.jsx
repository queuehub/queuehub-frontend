import React, { useState, useEffect } from 'react';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import { useDispatch } from 'AppState/react';

import { retrieveRoom } from '../data/room';
import { RoomChannelProvider } from './useRoomChannel';

import Nav from '../components/Nav';

import CurrentPlaying from './CurrentPlaying';
import Members from './Members';
import Search from './Search';
import NotFound from './NotFound';
import Browse from './Browse';

const Room = () => {
  const match = useRouteMatch('/room/:id');
  const dispatch = useDispatch();
  const [isError, setisError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveRoom(match.params.id)
      .then((roomData) => {
        dispatch({ type: 'initRoom', payload: roomData });
        setLoading(false);
      })
      .catch((errorResp) => {
        setisError(errorResp);
      });
  }, [dispatch, match.params.id]);

  if (isError) {
    return <Redirect to="/" />;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <RoomChannelProvider id={match.params.id}>
      <div>
        <Nav />
        <Switch>
          <Route exact path={`${match.url}`} component={CurrentPlaying} />
          <Route path={`${match.url}/members`} component={Members} />
          <Route path={`${match.url}/search`} component={Search} />
          <Route path={`${match.url}/browse`} component={Browse} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </RoomChannelProvider>
  );
};

export default Room;
