import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NotFound from './NotFound';
import { today } from '../utils/date-time';
import NewReservation from '../Reservations/NewReservation';
import NewTable from '../Tables/NewTable';
import SeatReservatopm from '../Reservations/SeatReservation';
import SearchReservation from '../Reservations/SearchReservation';
import EditReservation from '../Reservations/EditReservation'; //

function Routes() {
  return (
    <Switch>
      <Route exact={true} path='/'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route exact={true} path='/reservations'>
        <Redirect to={'/dashboard'} />
      </Route>
      <Route path='/dashboard'>
        <Dashboard date={today()} />
      </Route>
      <Route path='/reservations/new'>
        <NewReservation />
      </Route>
      <Route path='/reservations/:reservation_id/seat'>
        <SeatReservatopm />
      </Route>
      <Route path='/reservations/:reservation_id/edit'>
        <EditReservation />
      </Route>
      <Route path='/search'>
        <SearchReservation />
      </Route>
      <Route path='/tables/new'>
        <NewTable />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
