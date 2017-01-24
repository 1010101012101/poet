import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';

import '../extensions/String';
import './LatestWorks.scss';
import ProfileLink from './ProfileLink';

import Config from '../config';

import FetchComponent, { FetchComponentProps } from '../hocs/FetchComponent'

function renderWork(props: any) {
  return (
    <li key={props.id} className="row py-1">
      <div className="col-sm-8 mb-1 text-left">
        <div className="mb-1">{props.name || 'Untitled work'}</div>
        <div>{ props.author ? <ProfileLink id={props.author} /> : 'Unknown author' }</div>
      </div>
      <div className="col-sm-4 text-right">
        <div className="mb-1">{props.publicKey}</div>
        <div>{moment(props.published).fromNow()}</div>
      </div>
    </li>
  )
}

function render(props: LatestWorksProps) {
  return (
    <section className="latest-works p-2">
      <header>
        <h5>Latest Timestamps</h5>
        { props.showLink &&
          <div className="more-link"><Link to="/blocks">view all »</Link></div>
        }
      </header>
      <ul className="list-unstyled">
        { props.elements.map(renderWork) }
      </ul>
    </section>
  )
}

export interface LatestWorksProps extends FetchComponentProps {
  showLink: boolean
}

function propsToUrl(props: LatestWorksProps) {
  return {
    url: `${Config.api.explorer}/works`
  }
}

export default FetchComponent.bind(null, propsToUrl, render)();