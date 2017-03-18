import * as React from 'react';
import * as moment from 'moment';

import { Images } from '../../../images/Images';
import { Work } from '../../../Interfaces';
import { NotificationEvent } from '../../../store/PoetAppState';
import WorkComponent from '../../../components/hocs/WorkComponent';
import { PoetAPIResourceProvider } from '../../../components/atoms/base/PoetApiResource';
import { SelectWorkById } from '../../../components/atoms/Arguments';
import { renderEventMessage } from '../../Account/Notifications/Model';

import './HistoryTab.scss';

class HistoryList extends PoetAPIResourceProvider<Event[], SelectWorkById, undefined> {

  poetURL() {
    return {
      url: '/events',
      query: {
        work: this.props.workId
      }
    }
  }

  renderElement(resource: Event[], headers: Headers) {
    return (
      <ul>
        { resource.map(this.renderItem.bind(this)) }
      </ul>
    )
  }

  renderItem(event: NotificationEvent) {
    const text = renderEventMessage(event);
    return text && (
      <li key={event.id}>
        <img src={Images.SuccessMarkGreen} />
        <div className="message">{ text }</div>
        <div className="time">{ moment(event.timestamp).fromNow() }</div>
      </li>
    );
  }

}

function render(props: Work) {
  return (
    <div className="history-tab">
      <HistoryList workId={props.id} />
    </div>
  )
}

export default WorkComponent(render);