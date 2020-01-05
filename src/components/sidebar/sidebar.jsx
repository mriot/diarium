import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import Progress from "./progress";
import Calendar from "./calendar";
import MetaEditor from "./meta-editor";
import { getAllEntriesForYearMonth } from "../../lib/backend";

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

		this.state = {
			dateToday: moment(),
			forceUpdateCalendar: 0,
		};
	}

	componentDidMount() {
		setInterval(this.updateTodaysDate.bind(this), 1000 * 60 * 5); // 5 minutes
    
		getAllEntriesForYearMonth(this.state.dateToday.year(), this.state.dateToday.format("MM"))
			.then(entries => {
				this.setState({ entries });
			});
	}

	updateTodaysDate() {
		this.setState({ dateToday: moment() });
	}
  
	render() {
		return (
			<StyledSidebar>
				<Today onClick={() => {
					this.setState(prevState => ({
						dateToday: moment(),
						forceUpdateCalendar: prevState.forceUpdateCalendar + 1
					}));
				}}
				>
					{moment(this.state.dateToday).format("dddd, D. MMMM YYYY")}
				</Today>

				<Calendar
					fetchedEntries={this.state.entries}
					forceUpdateCalendar={this.state.forceUpdateCalendar}
				/>

				<MetaEditor isReadModeActive={this.props.isReadModeActive} />

				<Progress />
			</StyledSidebar>
		);
	}
}

Sidebar.propTypes = {
	isReadModeActive: PropTypes.bool.isRequired,
  
};
