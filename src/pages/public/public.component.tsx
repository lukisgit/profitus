import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {Dispatch} from "redux";
import {orderBy} from "lodash";
import {getContent} from "actions/contentActions";
import {ACTIONS, IStore} from "store";
import ReactPaginate from 'react-paginate';
import {CustomTableComponent} from 'shared/components/custom-table/custom-table.component';
import './public.component.scss';

interface IComponentState {
  isPagination: boolean;
  currentPage: number;
  pageCount: number;
  pageContent: any[],
  selectedData: any
}

interface IActionCreators {
  getContent: (url: string) => void;
  filterContent: (index: number) => void;
  selectContent: (index: number) => void;
}

const API = 'https://jsonplaceholder.typicode.com/photos';
const TABLE_LABELS = ["ID", "Title", "Url", "Thumbnail Url"];
const TABLE_ATTRIBUTES = ["id", "title", "url", "thumbnailUrl"];
const MAX_ITEMS_PER_PAGE = 10;

class PublicComponent extends React.Component<IActionCreators & Partial<IStore>> {

  state: IComponentState = {
    isPagination: true,
    currentPage: 0,
    pageCount: 0,
    pageContent: [],
    selectedData: null
  };

  render(){
    return (
      <React.Fragment>
        <h1>Profitus</h1>
        <div className="header">
            <input id="isPagination" type="checkbox" defaultChecked={this.state.isPagination} onChange={(event) => this.setState({ isPagination: !this.state.isPagination })}/>
            <label htmlFor="isPagination">pagination</label>
        </div>
          {
            !!this.state.selectedData && (
                  <table className="selected-data-table">
                    <tbody>
                      <tr>
                          { TABLE_ATTRIBUTES.map((attr: string, index: number) => <td key={index}>{ this.state.selectedData[attr] }</td>)}
                      </tr>
                    </tbody>
                  </table>)
          }
        { (!!this.props.data && !this.props.fetching) ? (<CustomTableComponent
          onFilter={(index: number) => this.props.filterContent(index)}
          onSelect={(data: any) => this.handleSelect(data)}
          labels={TABLE_LABELS}
          attributes={TABLE_ATTRIBUTES}
          length={this.props.data.length}
          filterColumnType={this.props.filterColumnType}
          filterColumnIndex={this.props.filterColumnIndex}
          selectedId={this.props.selectedId}
          data={!this.state.isPagination ? this.props.data : this.state.pageContent}/>) : (<div>loading...</div>) }
          <ReactPaginate
              previousLabel={"←"}
              nextLabel={"→"}
              breakLabel={<span className="gap">...</span>}
              pageCount={this.state.pageCount}
              onPageChange={this.handlePageClick}
              forcePage={this.state.currentPage}
              containerClassName={"pagination"}
              previousLinkClassName={"previous_page"}
              nextLinkClassName={"next_page"}
              disabledClassName={"disabled"}
              activeClassName={"active"}
              pageRangeDisplayed={5}
              marginPagesDisplayed={5}
          />
      </React.Fragment>
    );
  }

  componentDidMount(){
    this.props.getContent(API);
  }

  componentDidUpdate(prevProps: IActionCreators & Partial<IStore>){
    // Define initial page
    if(!prevProps.data && !!this.props.data){
      const getPageCount = this.props.data.length / MAX_ITEMS_PER_PAGE;
      const content = this.props.data.slice(this.state.currentPage * MAX_ITEMS_PER_PAGE, (this.state.currentPage + 1) * MAX_ITEMS_PER_PAGE);
      this.setState({ pageContent: content, pageCount: getPageCount });
    }

    // Define initial page counter
    if(!!prevProps.data && !!this.props.data && prevProps.data.length !== this.props.data.length){
      const getPageCount = this.props.data.length / MAX_ITEMS_PER_PAGE;
      this.setState({ pageCount: getPageCount });
    }

    // Detect new ordering
    if(prevProps.filterColumnIndex !== this.props.filterColumnIndex || prevProps.filterColumnType !== this.props.filterColumnType){
      if(!this.props.data){
        return;
      }
      const content = this.props.data.slice(this.state.currentPage * MAX_ITEMS_PER_PAGE, (this.state.currentPage + 1) * MAX_ITEMS_PER_PAGE);
      this.setState({ pageContent: content });
    }
  }

  handleSelect = (data: any) => {
    this.setState({
       selectedData: { ...data }
    });
    this.props.selectContent(data.id);
  };

  handlePageClick = (data: any) => {
    this.setState({
        currentPage: data.selected,
        pageContent: !!this.props.data ? this.props.data.slice(data.selected * MAX_ITEMS_PER_PAGE, (data.selected + 1) * MAX_ITEMS_PER_PAGE) : []
    });
  };
}

const dataSelector = (state: IStore) => state.data;
const filterColumnIndexSelector = (state: IStore) => state.filterColumnIndex;
const filterColumnTypeSelector = (state: IStore) => state.filterColumnType;

// Avoid extra computing
const getFilteredData = createSelector([dataSelector, filterColumnIndexSelector, filterColumnTypeSelector],
  (data: any[], filterColumnIndex: number, filterColumnType: 'asc' | 'desc') => {
    if(!!data) {
      const attrName = TABLE_ATTRIBUTES[filterColumnIndex];
      return orderBy(data, attrName, [filterColumnType]);
    }
    return data;
  });

function mapStateToProps (state: IStore): Partial<IStore> {
  return {
    data: getFilteredData(state),
    fetching: state.fetching,
    filterColumnType: state.filterColumnType,
    filterColumnIndex: state.filterColumnIndex,
    selectedId: state.selectedId
  };
}

function mapDispatchToProps(dispatch: Dispatch): IActionCreators {
  return {
    getContent: async (url: string) => await getContent(dispatch, url),
    filterContent: (index: number) => dispatch({ type: ACTIONS.FILTER_DATA, payload: { index } }),
    selectContent: (index: number) => dispatch({ type: ACTIONS.SELECT_ROW, payload: { index } }),
  }
}

export default connect<Partial<IStore>, IActionCreators, {}, IStore>(mapStateToProps, mapDispatchToProps)(PublicComponent);