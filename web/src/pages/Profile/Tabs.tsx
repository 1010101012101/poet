import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';

import { HexString } from '../../common';
import { Actions } from '../../actions/index';
import { DispatchesTransferRequested } from '../../actions/requests';
import { WorksTab } from './Works';
import { Licenses } from './Licenses';

import './Tabs.scss';

interface ProfileTabsProps extends DispatchesTransferRequested {
  readonly id: HexString;
  readonly sessionPublicKey: string;
}

const ProfileTabsComponent = (props: ProfileTabsProps) => (
  <Tabs className="tabs col-sm-9" >
    <TabList className="tab-list tab-option-group extended" activeTabClassName="selected">
      <Tab>Works</Tab>
      <Tab>Licenses</Tab>
    </TabList>
    <TabPanel>
      <WorksTab
        profileId={props.id}
        authenticatedUserIsOwner={props.sessionPublicKey && props.sessionPublicKey === props.id}
        transferRequested={props.transferRequested}
      />
    </TabPanel>
    <TabPanel>
      <Licenses
        profileId={props.id}
        authenticatedUserIsOwner={props.sessionPublicKey && props.sessionPublicKey === props.id}
      />
    </TabPanel>
  </Tabs>
);

function mapStateToProps(state: any, ownProps: ProfileTabsProps): ProfileTabsProps {
  return ownProps;
}

const mapDispatch: {} & DispatchesTransferRequested = {
  transferRequested: (workId: string) => ({ type: Actions.Transfer.TransferRequested, workId })
};

export const ProfileTabs = connect<ProfileTabsProps, DispatchesTransferRequested>(mapStateToProps, mapDispatch)(ProfileTabsComponent);