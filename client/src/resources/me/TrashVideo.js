import { Link, useLocation, useParams } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import moment from "moment"
const {REACT_APP_SERVER} = process.env

function TrashVideo() {
  const location = useLocation()
  const params = useParams()
  const [video, setVideo] = useState([]);
  const [courseIds, setCourseIds] = useState([]);
  const [videoID, setVideoID] = useState('');
  const [action, setAction] = useState('');
  const [boolean, setBoolean] = useState(true)
  const icons = useRef({
    default: 'oi oi-elevator',
    asc: 'oi oi-sort-ascending',
    desc: 'oi oi-sort-descending',
  });
  const types = useRef({
    asc: 'desc',
    desc: 'asc',
  })
  const [column, setColumn] = useState([
    {icon: icons.current.default, type: "desc"},
    {icon: icons.current.default, type: "desc"},
    {icon: icons.current.default, type: "desc"},
    {icon: icons.current.default, type: "desc"},
  ]);

  // function
  // Sắp xếp khóa học
  const sort = (num) => (e) => {
    let columnNew = column
    for(let index = 0; index < 4; index++) {
      if (index === num) continue
      else
        columnNew[index].icon = icons.current.default
        columnNew[index].type = "desc"
    }
    columnNew[num].type = types.current[columnNew[num].type]
    columnNew[num].icon = icons.current[columnNew[num].type]
    setColumn(columnNew)
  }
  
  // action onChange
  const handleAction = (e) => {
    setAction(e.target.value)
  }

  // toggle checked
  useEffect(() => {
    const checkboxAll = $('#checkbox-all')
    const courseItemCheckbox = $('input[name="courseIds[]"]')
    // Checkbox all
    checkboxAll.change(function (){
      var isCheckedAll = $(this).prop('checked');
      // console.log(isCheckedAll, courseItemCheckbox);
      courseItemCheckbox.prop("checked", isCheckedAll);
      renderCheckAllSubmitBtn();
    })
    // Course item checked
    courseItemCheckbox.change(function () {
      var isCheckedAll = courseItemCheckbox.length === $('input[name="courseIds[]"]:checked').length
      checkboxAll.prop('checked', isCheckedAll);
      renderCheckAllSubmitBtn();
    });
    // Re-render check submit all button
    const renderCheckAllSubmitBtn = () => {
      var checkedCount = $('input[name="courseIds[]"]:checked').length;
      if(checkedCount > 0) {
        setBoolean(false)
      } else {
        setBoolean(true)
      }
    }
  })

  const handleCheckAllSubmitBtn = (e) => {
    $('form[name="container-form"]').submit(function(e){
      return false;
    });
    if (action !== "") {
      let checked = []
      for(var i=0; i<$('input[name="courseIds[]"]:checked').length; i++) {
        checked.push($('.courseId:checked')[i].value)
      }
      setCourseIds(checked)
      window.$('#deleteAll-course-model').modal('toggle');
    }
  }
    
  const handleAllCourse = (e) => {
    // console.log(action, courseIds);
    axios({
      method: "post",
      data: {
          action: action,
          videoIDs: courseIds,
      },
      withCredentials: true,
      url: `${REACT_APP_SERVER}/me/trash/${params.id}/handle-form-actions-trash`
    })
    .then(ketqua => {
      document.getElementById("deleteAll-course-model").click()
      if(!ketqua.data) {
        alert(ketqua.data)
      }
      refreshVideo()
    })
  }

  // Close modal xoa nhieu khoa hoc
  const closeModal = () => {
    document.getElementById("delete-course-model").click()
  }
  // Close modal xoa nhieu khoa hoc
  const closeModalAll = () => {
    document.getElementById("deleteAll-course-model").click()
  }
  const deleteOne = (videoID) => (e) => {
    setVideoID(videoID)
  }
  // Xoa 1 khoa hoc
  const deleteVideo = (e) => {
    e.preventDefault()
    axios({
      method: "delete",
      data: {},
      withCredentials: true,
      url: `${REACT_APP_SERVER}/me/trash/${params.id}/delete/${videoID}/force`
    })
    .then(ketqua => {
      // console.log(typeof(ketqua.data), ketqua.data);
      if(!ketqua.data) {
        alert(ketqua.data)
      }
      refreshVideo ()
      closeModal()
    })
  }

  // Khoi phuc 1 khoa hoc
  const restoreOne = (videoID) => (e) => {
    e.preventDefault()
    // console.log(courseID);
    axios({
      method: "patch",
      data: {},
      withCredentials: true,
      url: `${REACT_APP_SERVER}/me/trash/${params.id}/restore/${videoID}`
    })
    .then(ketqua => {
      // console.log(typeof(ketqua.data), ketqua.data);
      if(!ketqua.data) {
        alert(ketqua.data)
      }
      refreshVideo()
    })
  }

  document.title = "Video đã xóa"

  const refreshVideo = (e) => {
    axios({
      method: "get",
      withCredentials: true,
      data: {},
      url: `${REACT_APP_SERVER+location.pathname+location.search}`
    })
    .then(ketqua => {
      let result = ketqua.data[0]
      setVideo(result)
    })
  }
  useEffect(() => {
    refreshVideo ()
  }, [location.search])
  return (
    <div>
      <div className="container">
        <form name="container-form" method="POST" className="mt-4">
          <div>
            <h3>Video đã xóa</h3>

            <div className="mt-4 mb-2 d-flex align-items-center">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="checkbox-all"/>
                <label className="form-check-label" htmlFor="checkbox-all" >
                  Chọn tất cả
                </label>
              </div>
              <select className="form-control form-control-sm checkbox-select-all-options" name="action" onChange={handleAction} required>
                <option value="">-- Hành động --</option>
                <option value="delete">Xóa vĩnh viễn</option>
                <option value="restores">Khôi phục</option>
              </select>
              <button className="btn btn-primary btn-sm check-all-submit-btn" id="check-all-submit-btn" disabled={boolean} onClick={handleCheckAllSubmitBtn}>Thực hiện</button>
              <Link to={`/me/stored/${params.id}/EditCourse`} className="btn btn-danger btn-sm ml-auto mr-2" title="Quay lại"><i className="fas fa-chevron-left"></i> Quay lại</Link>
            </div>
          </div>

          <table className="table">
              <thead>
                  <tr>
                      <th></th>
                      <th scope="col">STT</th>
                      <th scope="col">Tên khóa học <Link to={`?_sort&column=name&type=${column[0].type}`} onClick={sort(0)}> <span className={column[0].icon}></span></Link></th>
                      <th scope="col">Miêu tả khóa học <Link to={`?_sort&column=description&type=${column[1].type}`} onClick={sort(1)}> <span className={column[1].icon}></span></Link></th>
                      <th scope="col">Thời gian tạo <Link to={`?_sort&column=createdAt&type=${column[2].type}`} onClick={sort(2)}> <span className={column[2].icon}></span></Link></th>
                      <th scope="col">Thời gian cập nhật <Link to={`?_sort&column=updatedAt&type=${column[3].type}`} onClick={sort(3)}> <span className={column[3].icon}></span></Link></th>
                  </tr>
              </thead>
              {video.toString() ? video.map((video,index)=>(
                <tbody key={index}>
                    <tr>
                        <td>
                          <div className="form-check">
                            <input className="form-check-input courseId" type="checkbox" name="courseIds[]" value={video._id}/>
                          </div>
                        </td>
                        <th scope="row">{index+1}</th>
                        <td>{video.name}</td>
                        <td>
                          <div className="mb-3">{
                              video.description.split('\n').map(
                                  (str,index) => <div key={index}>{str}</div>)
                          }</div>
                        </td>
                        <td className="time">{moment(video.createdAt).format("L")}</td>
                        <td className="time">{moment(video.updatedAt).format("L")}</td>
                        <td>
                        <Link to="#" className="btn btn-link btn-restore" onClick={restoreOne(video._id)}>Khôi phục</Link>
                        <Link to="#" className="btn btn-link" data-toggle="modal" data-target="#delete-course-model" onClick={deleteOne(video._id)}>Xóa vĩnh viễn</Link>
                        </td>
                    </tr>
                </tbody>
              ))
              :
              (
                <tbody><tr>
                      <td colSpan="7" className="text-center"> Bạn chưa đăng khóa học nào!
                      </td>
                    </tr>
                </tbody>
              )
              }
          </table>
        </form>
      </div>

      <div id="delete-course-model" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xóa video?</h5>
              <button type="button" className="close closeModal" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc muốn xóa video này, hành động này không thể khôi phục?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary closeModal" data-dismiss="modal" onClick={closeModal}>Hủy</button>
              <button id="btn-deleteall-course" type="button" className="btn btn-danger"  onClick={deleteVideo}>Thực hiện</button>
            </div>
          </div>
        </div>
      </div>

      <div id="deleteAll-course-model" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xóa khóa học?</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModalAll}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {action === "delete" ? (<p>Hành động này không thể khôi phục, bạn vẫn muốn xóa các khóa học này?</p>) : (<p>Bạn vẫn muốn khôi phục các khóa học này?</p>)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModalAll}>Hủy</button>
              <button id="btn-delete-course" type="button" className="btn btn-danger" onClick={handleAllCourse}>Thực hiện</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrashVideo