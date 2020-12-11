import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import dayjs from "dayjs";

const StyledHighlightCard = styled.div`
  color: #222;
  display: flex;
  align-items: center;
  margin-top: 5px;
  border-radius: 10px;
  transform-origin: top;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.9);
  transition: background-color 0.2s;

  &:hover {
    background-color: rgb(255, 255, 255);
  }
`;
const DateDisplay = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  border-radius: 10px 0 0 10px;
  background-color: #fff;

  div {
    font-size: 30px;
    font-weight: bold;
  }

  span {
    font-size: 14px;
  }
`;
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;
const Desc = styled.div`

`;
const Tags = styled.div`

`;

export default function HighlightCard(props) {
  return (
    <StyledHighlightCard {...props}>
      <DateDisplay>
        <div>{dayjs(props.date).format("DD")}</div>
        <span>
          {dayjs(props.date).format("MMMM").substr(0, 3)}
        </span>
      </DateDisplay>
      <CardBody>
        <Desc>{props.desc}</Desc>
        <Tags>{props.tags}</Tags>
      </CardBody>
    </StyledHighlightCard>
  );
}

HighlightCard.defaultProps = {
  desc: "Keine Beschreibung... 🙉"
};

HighlightCard.propTypes = {
  date: PropTypes.objectOf(dayjs).isRequired,
  desc: PropTypes.string,
  tags: PropTypes.array
};
