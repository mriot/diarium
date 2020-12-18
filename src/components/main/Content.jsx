import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import "../../themes/content.scss";
import { motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { dayRecordAtom } from "../../atoms";
import { isEmptyObject } from "../../lib/utils";

export default function Content() {
  const dayRecord = useRecoilValue(dayRecordAtom);
  const [content, setContent] = useState("You should never see this.");
  let nodeRef = null;

  useEffect(() => {
    if (nodeRef) nodeRef.scrollTop = 0;
  }, [nodeRef]);

  useEffect(() => {
    if (!dayRecord) return null;

    if (isEmptyObject(dayRecord)) {
      setContent(`
        <h1 style='margin: 25% auto; text-align:center;'>
          Wow, such empty
          <p>🌚</p>
        </h1>
      `);
    } else {
      setContent(dayRecord.content);
    }
  }, [dayRecord]);

  return (
    <div className="content-view" ref={(ref) => (nodeRef = ref)}>
      <motion.div
        style={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={content}
      >
        {parse(content)}
      </motion.div>
    </div>
  );
}

Content.propTypes = {};
