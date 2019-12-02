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

export const CustomTableComponent: React.FC<IComponent> = (props: IComponent) => {
    return (
    <React.Fragment>
      {props.labels.length === props.attributes.length && <table className="table">
        <thead>
        <tr>
          {
            props.labels.map((label: string, index: number) => (
              <th
                key={index} onClick={() => props.onFilter(index)}>
                {label}
                {
                  index === props.filterColumnIndex && (
                  <span>
                    {props.filterColumnType === 'asc' ? <FontAwesomeIcon icon={faArrowUp}/> : <FontAwesomeIcon icon={faArrowDown}/>}
                  </span>
                )
                }
              </th>))
          }
        </tr>
        </thead>
        <tbody>
        {
          props.data.map((item: any) => (
            <tr key={item.id}>
              {
                props.attributes.map((attribute: string, index) => (<td key={index}>{item[attribute]}</td>))
              }
            </tr>
          ))
        }
        </tbody>
      </table>}
    </React.Fragment>
    );
};