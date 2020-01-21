import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import { GlobalContext } from "../../contexts";

const StyledMetaData = styled.div `
	display: flex;
	justify-content: center;
	flex-direction: column;
	flex: 1;
	font-size: 14px;
	padding: 5px;
	border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;
const MetaInfoBlock = styled.div `
	color: #fff;

	span {
		display: block;
	}
`;

export default class MetaData extends React.PureComponent {
	render() {
		const { GLOBAL_DAYRECORD } = this.context;

		return (
			<StyledMetaData>
				<MetaInfoBlock>
					<span>Zuletzt bearbeitet:</span>
					{GLOBAL_DAYRECORD ? moment(GLOBAL_DAYRECORD.updatedAt).format("dd, D.MM.YYYY HH:mm:ss") : "n/a"}
				</MetaInfoBlock>

				<MetaInfoBlock>
					<span>Erstellt:</span>
					{GLOBAL_DAYRECORD ? moment(GLOBAL_DAYRECORD.createdAt).format("dd, D.MM.YYYY — HH:mm:ss") : "n/a"}
				</MetaInfoBlock>
			</StyledMetaData>
		);
	}
}

MetaData.propTypes = {
	
};

MetaData.defaultProps = {
	
};

MetaData.contextType = GlobalContext;
