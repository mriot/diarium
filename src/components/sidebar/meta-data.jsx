import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import { GlobalContext } from "../../contexts";
import { WHITE } from "../../themes/diarium-theme";

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
	color: ${WHITE};
	padding: 5px 0;

	span {
		opacity: 0.5;
		display: block;
	}
`;

export default class MetaData extends React.PureComponent {
	render() {
		const { GLOBAL_DAYRECORD } = this.context;

		return (
			<StyledMetaData>
				<MetaInfoBlock>
					Zuletzt bearbeitet:
					<span>
						{GLOBAL_DAYRECORD ? `${moment(GLOBAL_DAYRECORD.updatedAt).format("dd, D.MM.YYYY — HH:mm:ss")} Uhr` : "n/a"}
					</span>
				</MetaInfoBlock>

				<MetaInfoBlock>
					Erstellt:
					<span>
						{GLOBAL_DAYRECORD ? `${moment(GLOBAL_DAYRECORD.createdAt).format("dd, D.MM.YYYY — HH:mm:ss")} Uhr` : "n/a"}
					</span>
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
