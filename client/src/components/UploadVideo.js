import React, { useState } from 'react';
import { FilePond, File, registerPlugin } from 'react-filepond';
 
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';
const {REACT_APP_SERVER} = process.env


registerPlugin(FilePondPluginFileValidateSize);

const test = () => {
  console.log();
}

function UploadVideo() {
  const [files, setFiles] = useState([]);
  return (
      <div>
        <FilePond
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={false}
          server={`${REACT_APP_SERVER}/me/upload`}
          maxFiles="1"
          name="file"
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          onprocessfile={(error, file) => { console.log('done', JSON.parse)}}
        />
        
      </div>
  )
}

export default UploadVideo