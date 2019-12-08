import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MetaEditorContainer = styled.div `
	color: #fff;
	width: 100%;
	flex: 1;
	padding: 15px 5px;
	box-sizing: border-box;
	border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`

export default class MetaEditor extends React.PureComponent {
	render() {
		return (
			<MetaEditorContainer>
				Hello World!
			</MetaEditorContainer>
		);
	}
}

MetaEditor.propTypes = {
	
}
