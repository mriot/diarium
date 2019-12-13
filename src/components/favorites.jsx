import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const FavoritesContainer = styled.div `
	display: flex;
`

export default class Favorites extends React.PureComponent {
	render() {
		return (
			<FavoritesContainer>
				LOREM IPSUM
			</FavoritesContainer>
		);
	}
}

Favorites.propTypes = {
	
}
