import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

function App({ placeholder }) {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = useMemo(
    () => ({
      // zIndex: 0,
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Start typings...",
      uploader: {
        insertImageAsBase64URI: true,
      },
    }),
    [placeholder]
  );

  return (
    <>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => setContent(newContent)}
      />
      {content}
    </>
  );
}

export default App;
