import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import Progress from "./progress";
import Calendar from "./calendar";
import MetaEditor from "./meta-editor";
import Loadingbar from "../common/loadingbar";

const StyledSidebar = styled.aside `
  position: relative;
  width: 300px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  box-sizing: border-box;
  background-color: #20232a;
`;
const Today = styled.div `
  color: #fff;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

export default class Sidebar extends React.PureComponent {
	constructor(props) {
		super(props);

		this.sharedMethods = {};

		this.state = {
			dateToday: moment(),
			dayRecord: {},
			loadingbar: false,
		};
	}

	componentDidMount() {
		setInterval(() => this.updateTodaysDate, 1000 * 60 * 5); // 5 minutes
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.dayRecord !== this.state.dayRecord) {
			this.props.getDayRecord(this.state.dayRecord);
		}
	}

	updateTodaysDate() {
		this.setState({ dateToday: moment() });
	}
  
	render() {
		const { dayRecord, dateToday, loadingbar } = this.state;

		return (
			<StyledSidebar>
				<Today onClick={() => {
					this.sharedMethods.resetCalendarToToday();
					this.updateTodaysDate();
				}}
				>
					{moment(dateToday).format("dddd, D. MMMM YYYY")}
				</Today>

				<Loadingbar active={loadingbar} />

				<Calendar
					shareMethods={sharedMethods => (this.sharedMethods = sharedMethods)}
					getDayRecord={record => this.setState({ dayRecord: record })}
					showLoadingbar={status => this.setState({ loadingbar: status })}
				/>

				<MetaEditor
					isReadModeActive={this.props.isReadModeActive}
					recordID={dayRecord && dayRecord.id}
					tags={dayRecord && dayRecord.tags}
				/>

				<Progress />
			</StyledSidebar>
		);
	}
}

Sidebar.propTypes = {
	isReadModeActive: PropTypes.bool.isRequired,
	getDayRecord: PropTypes.func.isRequired,
};
