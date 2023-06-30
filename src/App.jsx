import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Base64 } from "js-base64";
import { io } from "socket.io-client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { useParams } from "react-router-dom";
import Editor from "./Editor";

function App() {
  // const { id: documentId } = useParams();
  // const params = useParams();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [socket, setSocket] = useState();
  // console.log(params);

  // useEffect(() => {
  //   socket.emit("get-document", documentId);
  // }, [socket, content, documentId]);

  // Connect
  useEffect(() => {
    const s = io("http://localhost:9000");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

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

  const config = useMemo(
    () => ({
      // readonly: false,
      // readonly: true,
      // toolbar: false,
      pageBreak: {
        separator: "<!-- pagebreak -->",
      },
      allowResizeX: false,
      allowResizeY: false,
      placeholder: "Start typings...",
      uploader: {
        insertImageAsBase64URI: true,
      },
      removeButtons: ["eraser", "about"],
      controls: {
        font: {
          list: {
            "": "Default",
            "Roboto Medium,Arial,sans-serif": "Roboto",
          },
        },
      },
    }),
    []
  );

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
        <Route path="/documents/:id">
         <Editor />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

// import React, { useState } from 'react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor } from '@ckeditor/ckeditor5-react';

// const Editor = () => {
// //   const [editorInstance, setEditorInstance] = useState();
//   const [pages, setPages] = useState([]);

// //   const handleEditorReady = (editor) => {
// //     setEditorInstance(editor);
// //   };

//   const handleAddPage = () => {
//     // console.log("mmm", editorInstance);
//     // if (editorInstance) {
//       const newPage = {
//         id: Date.now().toString(),
//         content: '',
//       };
//       setPages((prevPages) => [...prevPages, newPage]);
//     // }
//   };

//   const handleContentChange = (event, editor) => {
//     // const { pageId } = editor.ui.view.document.getRoot().rootNode.parentNode;
//     // const updatedPage = pages.find((page) => page.id === pageId);
//     // if (updatedPage) {
//     //   updatedPage.content = editor.getData();
//     //   setPages([...pages]);
//     // }
//   };

//   return (
//     <div>
//       <h2>CKEditor 5 Example - Multiple Pages</h2>
//       <button onClick={handleAddPage}>Add Page</button>
//       {pages.map((page) => (
//         <div key={page.id}>
//           <h3>Page: {page.id}</h3>
//           <CKEditor
//             editor={ClassicEditor}
//             data={page.content}
//             onChange={handleContentChange}
//             // onReady={handleEditorReady}
//             config={{
//               // Add any additional CKEditor configuration options here
//             }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Editor;

// import React, { useState } from 'react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor } from '@ckeditor/ckeditor5-react';

// const Editor = () => {
//   const [editorInstance, setEditorInstance] = useState(null);
//   const [pages, setPages] = useState([]);

//   const handleEditorReady = (editor) => {
//     setEditorInstance(editor);
//   };

//   const handleAddPage = () => {
//     if (editorInstance) {
//       const newPage = {
//         id: Date.now().toString(),
//         content: '',
//       };
//       setPages((prevPages) => [...prevPages, newPage]);
//     }
//   };

//   const handleContentChange = (event, editor) => {
//     const { pageId } = editor.ui.view.document.getRoot().rootNode.parentNode;
//     const updatedPage = pages.find((page) => page.id === pageId);
//     if (updatedPage) {
//       updatedPage.content = editor.getData();
//       setPages([...pages]);
//     }
//   };

//   return (
//     <div>
//       <h2>CKEditor 5 Example - Multiple Pages</h2>
//       <button onClick={handleAddPage}>Add Page</button>
//       {pages.map((page) => (
//         <div key={page.id}>
//           <h3>Page: {page.id}</h3>
//           <CKEditor
//             editor={ClassicEditor}
//             data={page.content}
//             onChange={handleContentChange}
//             onReady={handleEditorReady}
//             config={{
//               // Add any additional CKEditor configuration options here
//             }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Editor;
