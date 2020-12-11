import React, { useEffect } from "react";
import styled from "styled-components";
import parse from "html-react-parser";
import PropTypes from "prop-types";
import "../../themes/content.scss";
import { useRecoilState } from "recoil";
import { dayRecordAtom } from "../../atoms";

const StyledContent = styled.div`
  /* Reset */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  * {
    box-sizing: border-box;
  }

  /* Variables and defaults */
  && {
    --desktop-font-size: 16px;
    --mobile-font-size: 16px;
    --text-color: #efefef;
    --link-color: #00b7ff;
    --primary-color: #161616;
    --secondary-color: #333;
    --tertiary-color: #555;

    padding: 0 20px;
    color: var(--text-color);
    font: var(--desktop-font-size) -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto, Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji", "Segoe UI Symbol";
  }

  h1,h2,h3,h4,h5,h6,p,blockquote,dl,img,figure {
    margin: 1rem 0;
  }

  h1,h2,h3,h4,h5,h6 { font-weight: bold; line-height: 1.2; }
  h1 { font-size: 200%; }
  h2 { font-size: 150%; }
  h3 { font-size: 120%; }
  h4,h5,h6 { font-size: 100%; }
  h5,h6 { text-transform: uppercase; }

  header h1 { border-bottom: 1px solid; }

  p { margin: 2rem 0; }

  a,a:visited { color: var(--link-color); }

  strong, time, b { font-weight: bold; }
  em, dfn, i { font-style: italic; }
  sub { font-size: 60%; vertical-align: bottom; }
  small { font-size: 80%; }

  blockquote, q {
    background: rgb(255 255 255 / 3%);
    border-left: 10px solid #efefef;
    display: block;
    font-family: "Georgia",serif;
    padding: 1rem;
    border-radius: 5px 0 0 5px;
  }
  blockquote p:first-child { margin-top: 0; }
  cite {
    font-family: "Georgia", serif;
    font-style: italic;
    font-weight: bold;
  }

  kbd,code,samp,pre,var { font-family: monospace; font-weight: bold; }
  code, pre {
    background: var(--tertiary-color);
    padding: 0.5rem 1rem;
  }
  code pre , pre code { padding: 0; }



  /* Elements */
  hr {
    background: var(--text-color);
    border: 0;
    height: 1px;
    margin: 1rem 0;
  }

  img {
    display: block;
    height: auto; 
    max-width: 100%; 
  }

  figure {
    border: 1px solid var(--primary-color);
    display: inline-block;
    padding: 1rem;
    width: auto;
  }
  figure img { margin: 0; }
  figure figcaption { font-size: 80%; margin-top: 0.5rem; }

  ul, ol { margin: 2rem 0; padding: 0 0 0 4rem; }

  dl dd { padding-left: 2rem; }

  table {
    border: 1px solid var(--primary-color);
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
  }
  table caption { margin: 2rem 0; }
  table thead { text-align: center; }
  table tbody { text-align: right; }
  table tr { border-bottom: 1px solid var(--primary-color); }
  table tbody tr:nth-child(even) { background: var(--tertiary-color); }
  table th { background: var(--secondary-color); font-weight: bold; }
  table th, table td { padding: 1rem; }
  table th:not(last-of-type), table td:not(last-of-type) { 
    border-right: 1px solid var(--primary-color); 
  }

  input { 
    appearance: none; 
    border: 1px solid var(--text-color);
    display: block;
    margin: 0.5rem 0;
    padding: 0.8rem; 
  }
  input:focus, input:active {
    background-color: var(--secondary-color); 
    border-color: var(--link-color); 
  }


  .mce-time-separator {
  display: flex;
  align-items: center;
  text-align: center;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #000;
  }

  &::before {
    margin-right: .25em;
  }
  
  &::after {
    margin-left: .25em;
  }
}
`;

export default function Content(props) {
  const dayRecord = useRecoilState(dayRecordAtom);
  let nodeRef = null;

  useEffect(() => {
    nodeRef.scrollTop = 0;
  }, [dayRecord, nodeRef]);

  return (
    <div
      className="content-view"
      ref={(ref) => (nodeRef = ref)}
    >
      {parse(props.children)}
    </div>
  );
}

Content.propTypes = {
  children: PropTypes.string.isRequired
};
