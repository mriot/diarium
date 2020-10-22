import { WHITE } from "../../themes/diarium-theme";
import { dayRecordAtom } from "../../atoms";
import { useRecoilValue } from "recoil";
import PropTypes from "prop-types";
import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";

const StyledMetaData = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  font-size: 14px;
  padding: 5px;
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;
const MetaInfoBlock = styled.div`
  color: ${WHITE};
  padding: 5px 0;

  span {
    opacity: 0.5;
    display: block;
  }
`;

export default function MetaData() {
  const dayRecord = useRecoilValue(dayRecordAtom);

  return (
    <StyledMetaData>
      <MetaInfoBlock>
          Zuletzt bearbeitet:
        <span>
          {dayRecord ? `${dayjs(dayRecord.updated_at).format("dd, D.MM.YYYY — HH:mm:ss")} Uhr` : "n/a"}
        </span>
      </MetaInfoBlock>

      <MetaInfoBlock>
          Erstellt:
        <span>
          {dayRecord ? `${dayjs(dayRecord.created_at).format("dd, D.MM.YYYY — HH:mm:ss")} Uhr` : "n/a"}
        </span>
      </MetaInfoBlock>
    </StyledMetaData>
  );
}

MetaData.propTypes = {

};

MetaData.defaultProps = {

};
