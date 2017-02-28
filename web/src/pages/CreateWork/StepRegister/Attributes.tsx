import * as React from 'react';
const classNames = require('classnames');

import { AttributeNameAutocomplete } from './AttributeAutocomplete';
import { ClassNameProps } from '../../../common';

import './Attributes.scss';

export interface Attribute {
  name: string;
  value: string;
}

interface AttributesState {
  readonly attributes: ReadonlyArray<Attribute>;
}

export class Attributes extends React.Component<ClassNameProps, AttributesState> {
  private attributeKeyInputs?: HTMLInputElement[] = [];
  private readonly defaultAttributes: ReadonlyArray<Attribute> = [
    {
      name: 'name',
      value: ''
    }
  ];

  constructor() {
    super(...arguments);
    this.state = {
      attributes: [ ...this.defaultAttributes ]
    }
  }

  render() {
    return (
      <section className={classNames('attributes', this.props.className)}>
        <h2>Attributes</h2>
        <form>
          { this.state.attributes.map(this.renderField.bind(this)) }
        </form>
        <button
          onClick={this.onAddAttribute.bind(this)}
          className="button-secondary">Add Field</button>
      </section>
    )
  }

  private renderField({name, value}: Attribute, index: number): JSX.Element {
    return (
      <div key={index} className="row">
        <div className="col-sm-4">
            <AttributeNameAutocomplete
              onChange={this.onKeyChange.bind(this, index)}
              attributeName={name}
            />

        </div>
        <div className="col-sm-7">
          <input
            onChange={this.onValueChange.bind(this, index)}
            type="text"
            placeholder="Attribute Value"
            value={value} />
        </div>
        <div className="col-sm-1">
          <button
            onClick={this.onRemoveAttribute.bind(this, index)}
            className="remove button-secondary">—</button>
        </div>
      </div>
    );
  }

  private setAttributeInputRef(index: number, attributeKeyInput: HTMLInputElement) {
    this.attributeKeyInputs[index] = attributeKeyInput;
  }

  private onValueChange(index: number, event: any) {
    const attributes = [ ...this.state.attributes ];
    attributes[index].value = event.target.value;
    this.setState({
      attributes
    });
  }

  private onKeyChange(index: number, name: string) {
    const attributes = [ ...this.state.attributes ];
    attributes[index].name = name;
    this.setState({
      attributes
    });
  }

  private onAddAttribute() {
    if (!this.state.attributes[this.state.attributes.length - 1].name) {
      this.attributeKeyInputs[this.attributeKeyInputs.length - 1].focus();
      return;
    }

    this.setState({
      attributes: [ ...this.state.attributes, {
        name: '',
        value: ''
      } ]
    })
  }

  private onRemoveAttribute(index: number, event: any) {
    event.preventDefault();
    this.setState({
      attributes: [ ...this.state.attributes.filter((el, idx) => idx !== index) ]
    });
  }
}
