import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Base64 } from "js-base64";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import insert_page_break from "./split-pages.png";
import "./App.css";

function Editor() {
  const { id: documentId } = useParams();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [socket, setSocket] = useState();
  const SAVE_INTERVAL_MS = 2000;

  // Connect
  useEffect(() => {
    const s = io("http://localhost:9000");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Save document in db in every 2 second interval
  useEffect(() => {
    if (socket === undefined || content === "") return;

    const interval = setInterval(() => {
      socket.emit("save-document", content);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, content]);

  // Send the documentId and load the document
  useEffect(() => {
    if (socket === undefined) return;
    console.log(`reached`, socket);

    socket.once("load-document", (document) => {
      console.log("nmnmnm", document);
      setContent(document);
      // now enable the editor
    });

    socket.emit("get-document", documentId);
  }, [socket, documentId]);

  // Send
  useEffect(() => {
    if (socket === null || content === "") return;
    socket.emit("send-changes", content);
  }, [socket, content]);

  // Receive
  useEffect(() => {
    if (socket === null || content === "") return;

    const handler = (content) => {
      setContent(content);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, content]);

  // const config = useMemo(
  //   () => ({
  //     readonly: false,
  //     // readonly: true,
  //     // toolbar: false,
  //     pageBreak: {
  //       separator: "<!-- pagebreak -->",
  //     },
  //     allowResizeX: false,
  //     allowResizeY: false,
  //     placeholder: "Start typings...",
  //     uploader: {
  //       insertImageAsBase64URI: true,
  //     },
  //     removeButtons: ["eraser", "about"],
  //     controls: {
  //       font: {
  //         list: {
  //           "": "Default",
  //           "Roboto Medium,Arial,sans-serif": "Roboto",
  //         },
  //       },
  //     },
  //   }),
  //   []
  // );
  const insertPageBreak = (editor) => {
    const pageBreakElement = editor.ownerDocument.createElement("div");
    pageBreakElement.className = "page-break html2pdf__page-break";
    pageBreakElement.innerHTML = "Page Brake";
    pageBreakElement.setAttribute("contenteditable", "false");
    editor.selection.insertNode(pageBreakElement);
  };

  const pageBreak = {
    name: "page Break",
    iconURL: insert_page_break,
    tooltip: "Insert Page Break",
    exec: insertPageBreak,
  };
  const buttons = [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "superscript",
    "subscript",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "link",
    "table",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "fullsize",
    "selectall",
    "print",
    "|",
    "source",
    "|",
    pageBreak,
    // {
    //   name: "exportToPdf",
    //   icon: "",
    //   tooltip: "Export to Pdf",
    //   exec: exportToPdf,
    // },
  ];
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      toolbar: true,
      spellcheck: true,
      language: "en",
      toolbarButtonSize: "medium",
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: true,
      askBeforePasteFromWord: true,
      //defaultActionOnPaste: "insert_clear_html",
      buttons: buttons,
      uploader: {
        insertImageAsBase64URI: true,
      },
      font: {
        selected: "Arial",
      },
      overflow: false,
      width: 816,
      height: 1056,
    }),
    []
  );

  return (
    <>
      <JoditEditor
        ref={editor}
        value={content}
        config={editorConfig}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
        onChange={(newContent) => setContent(newContent)}
      />
      {/* {content} */}
      {Base64.encode(content)}
      {/* {btoa(encodeURIComponent(content))} */}
      {/* {Buffer.from(content, 'binary').toString('base64')} */}
    </>
  );
}

export default Editor;
