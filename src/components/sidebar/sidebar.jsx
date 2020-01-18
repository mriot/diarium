import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import Progress from "./progress";
import Calendar from "./calendar";
import Loadingbar from "../common/loadingbar";
import TagEditor from "./tag-editor";

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
			loadingbar: false,
		};
	}

	componentDidMount() {
		setInterval(() => {
			if (moment(this.state.dateToday).diff(moment(), "days") > 0) {
				console.log("'todaysDate' is one day behind — updating...");
				this.updateTodaysDate();
			}
		}, 1000 * 60); // 1 min

		// check date after user inactivity ended
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden && moment(this.state.dateToday).diff(moment(), "days") > 0) {
				console.log("'todaysDate' is one day behind — updating...");
				this.updateTodaysDate();
			}
		});
	}

	updateTodaysDate() {
		this.setState({ dateToday: moment() },
			() => console.log("Updated 'todaysDate' 👍"));
	}
  
	render() {
		const { dateToday, loadingbar } = this.state;

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
					showLoadingbar={status => this.setState({ loadingbar: status })}
				/>

				<TagEditor />

				<Progress />
			</StyledSidebar>
		);
	}
}

Sidebar.propTypes = {
	isReadModeActive: PropTypes.bool.isRequired,
};
