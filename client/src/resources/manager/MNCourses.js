import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import moment from "moment"
import {isValidHttpUrl} from "../../components/Func"

const {REACT_APP_SERVER} = process.env

function MNCourse() {
  // Khai bai
  const location = useLocation()
  const [user, setUser] = useState();

  useEffect(() => {
      axios({
          method: "get",
          withCredentials: true,
          url: `${REACT_APP_SERVER}/account/getUser`
      })
      .then(ketqua => {
          // console.log(ketqua.data.user, user);
          if (JSON.stringify(ketqua.data.user) !== JSON.stringify(user))
              setUser(ketqua.data.user)
      })
  })
  const navigate = useNavigate()
  const [deleteID, setDeleteID] = useState('')
  const [course, setCourse] = useState([]);
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
    {icon: icons.current.default, type: "desc"},
  ]);

  // function
  document.title = "Quản lý khóa học"

  // Close modal xoa nhieu khoa hoc
  const closeModal = () => {
    document.getElementById("delete-course-model").click()
  }
  // Xoa 1 khoa hoc
  const deleteCourse = (deleteID) => (e) => {
    e.preventDefault()
    axios({
      method: "delete",
      data: {},
      withCredentials: true,
      url: `${REACT_APP_SERVER}/courses/${deleteID}`
    })
    .then(ketqua => {
      // console.log(typeof(ketqua.data), ketqua.data);
      if(!ketqua.data) {
        alert(ketqua.data)
      }
      refreshCourse()
      document.getElementById("delete-course-model").click()
    })
  }

  const sort = (num) => (e) => {
    let columnNew = column
    for(let index = 0; index < 5; index++) {
      if (index === num) continue
      else
        columnNew[index].icon = icons.current.default
        columnNew[index].type = "desc"
    }
    columnNew[num].type = types.current[columnNew[num].type]
    columnNew[num].icon = icons.current[columnNew[num].type]
    setColumn(columnNew)
  }

  const refreshCourse = (e) => {
    axios({
      method: "get",
      withCredentials: true,
      data: {},
      url: `${REACT_APP_SERVER+location.pathname+location.search}`
    })
    .then(ketqua => {
      let result = ketqua.data[0]
      setCourse(result)
    })
  }

  useEffect(() => {
    if(user)
      if(user.role !== "admin") {
        navigate("/courses")
      }
    refreshCourse()
  }, [location.search, user])

  return (
    <div>
      <div className="container">
        <form>
            <div className="container-xl">
              <div className="row mt-3">
                  <h3 className="mb-0 col-sm-8"><b>Quản lý khóa học</b></h3>
                  <div className="col-sm-4 text-right">
                      <Link to="/manager/TrashMnCourses" className="btn btn-danger btn-sm ml-auto mr-2" title="Khóa học đã xóa"><i className="fas fa-trash"></i> Khóa học đã xóa</Link>
                      <Link to="/courses" className="btn btn-success btn-sm ml-auto mr-2" title="Quay lại khóa học"><i className="fas fa-play"></i> khóa học</Link>
                  </div>
              </div>
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                      <div className="row">
                          <p className="mb-0 mt-2"><b>Total:</b> <span className="total">{course.length}</span></p>
                      </div>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Tên khóa học <Link to={`?_sort&column=name&type=${column[0].type}`} onClick={sort(0)}> <span className={column[0].icon}></span></Link></th>
                        <th scope="col">Miêu tả khóa học <Link to={`?_sort&column=description&type=${column[1].type}`} onClick={sort(1)}> <span className={column[1].icon}></span></Link></th>
                        <th scope="col" width="200px">Người đăng <Link to={`?_sort&column=actor&type=${column[2].type}`} onClick={sort(2)}> <span className={column[2].icon}></span></Link></th>
                        <th scope="col">Thời gian tạo <Link to={`?_sort&column=createdAt&type=${column[3].type}`} onClick={sort(3)}> <span className={column[3].icon}></span></Link></th>
                        <th scope="col">Thời gian cập nhật <Link to={`?_sort&column=updatedAt&type=${column[4].type}`} onClick={sort(4)}> <span className={column[4].icon}></span></Link></th>
                        <th scope="col">Công cụ</th>
                      </tr>
                    </thead>

                    {course.toString() ? course.map((course,index)=>(
                      <tbody key={index}>
                          <tr>
                              <th scope="row">{index+1}</th>
                              <td>{course.name}</td>
                              <td>
                                <div className="mb-3">{
                                    course.description.split('\n').map(
                                        (str,index) => <div key={index}>{str}</div>)
                                }</div>
                              </td>
                              <td>
                                <p><img src={isValidHttpUrl(course.actor.image) ? course.actor.image : `${REACT_APP_SERVER + course.actor.image}`} className="user-avatar" /><b>{course.actor.username}</b></p>
                              </td>
                              <td className="time">{moment(course.createdAt).format("L")}</td>
                              <td className="time">{moment(course.updatedAt).format("L")}</td>
                              <td>
                                <Link to={`/me/stored/${course._id}/EditCourse`} state={location.pathname} className="edit" title="Sửa"><i className="fas fa-user-edit"></i></Link>
                                <Link to="#" className="delete" title="Xóa" data-toggle="modal" data-target="#delete-course-model" onClick={()=>{setDeleteID(course._id)}}><i className="fas fa-trash-alt"></i></Link>
                              </td>
                          </tr>
                      </tbody>
                    ))
                    :
                    (
                      <tbody><tr>
                            <td colSpan="7" className="text-center"> Hệ thống chưa ghi nhận khóa học nào ^.^!
                            </td>
                          </tr>
                      </tbody>
                    )}

                  </table>
                </div>
              </div>
            </div>
        </form>
      </div>

      <div id="delete-course-model" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xóa khóa học?</h5>
              <button type="button" className="close closeModal" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc muốn xóa khóa học này ?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary closeModal" data-dismiss="modal" onClick={closeModal}>Hủy</button>
              <button id="btn-deleteall-course" type="button" className="btn btn-danger"  onClick={deleteCourse(deleteID)}>Thực hiện</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MNCourse