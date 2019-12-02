import React from 'react';
import './custom-table.component.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

interface IComponent {
  data: any[];
  length: number;
  labels: string[];
  attributes: string[];
  filterColumnIndex?: number;
  filterColumnType?: 'asc' | 'desc';
  onFilter: (index: number) => void;
}

export class CustomTableComponent extends React.Component<IComponent> {

  render() {
    return (
    <React.Fragment>
      {this.props.labels.length === this.props.attributes.length && <table className="table">
        <thead>
        <tr>
          {
            this.props.labels.map((label: string, index: number) => (
              <th
                key={index} onClick={() => this.props.onFilter(index)}>
                {label}
                {
                  index === this.props.filterColumnIndex && (
                  <span>
                    {this.props.filterColumnType === 'asc' ? <FontAwesomeIcon icon={faArrowUp}/> : <FontAwesomeIcon icon={faArrowDown}/>}
                  </span>
                )
                }
              </th>))
          }
        </tr>
        </thead>
        <tbody>
        {
          this.props.data.map((item: any) => (
            <tr key={item.id}>
              {
                this.props.attributes.map((attribute: string, index) => (<td key={index}>{item[attribute]}</td>))
              }
            </tr>
          ))
        }
        </tbody>
      </table>}
    </React.Fragment>
    );
  }

}